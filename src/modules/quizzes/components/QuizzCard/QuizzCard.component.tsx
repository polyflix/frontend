import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Chip,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { DraftTag } from '@core/components/Chip/Draft.component'
import { NewTag } from '@core/components/Chip/New.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { VisibilityIcons } from '@core/components/Visibility/Icons/VisibilityIcons.component'
import { Element } from '@core/models/element.model'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Quizz } from '@quizzes/models/quizz.model'
import { useGetAttemptsQuery } from '@quizzes/services/attempt.service'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'
import { User } from '@users/models/user.model'

import { getFeedbackColor, percentage } from '../../helpers/score.helper'
import { QuizzAttemptCard } from '../QuizzAttemptCard/QuizzAttemptCard.component'
import { QuizzSliderOption } from './QuizzCardOption.component'

interface Props {
  quizz: Element<Quizz>
  displayCreationDate?: boolean
  displayScoreMethod?: boolean
  displayTags?: boolean
  displayScore?: boolean
  displayDraft?: boolean
  displayVisibility?: boolean
  displayNumberOfQuestions?: boolean
  displayPublisher?: boolean
  displayCrudOptions?: boolean
  variant?: 'link' | 'accordion' | 'none'
}

// Component used to display a quizz in the UI
export const QuizzCard = ({
  quizz,
  displayCreationDate = true,
  displayScoreMethod = false,
  displayTags = false,
  displayScore = false,
  displayDraft = false,
  displayVisibility = false,
  displayNumberOfQuestions = true,
  displayPublisher = true,
  displayCrudOptions = false,
  variant = 'link',
}: Props) => {
  const theme = useTheme()
  const { t } = useTranslation('quizzes')
  const { user } = useAuth()

  // We want to label the quizz as new if it was created less of 7 days ago.
  const isNew = Math.abs(dayjs(quizz.createdAt).diff(dayjs(), 'day')) < 7

  const { data: attempts, isLoading: isAttemptsLoading } = useGetAttemptsQuery({
    id: quizz.id,
    filters: { userId: user!.id },
  })

  // We use state because of attempts could be loaded after the component and need hot refresh
  const [score, setScore] = useState(0)
  const [color, setColor] = useState('')

  useEffect(() => {
    if (attempts) {
      let computedScore = quizz.data.keepHighestScore
        ? attempts!.data
            .map((attempt) => attempt.score)
            .sort((a, b) => b - a)[0]
        : attempts!.data
            .map((attempt) => attempt.score)
            .reduce((a, b) => a + b, 0)
      setScore(computedScore)
    }
    setColor(
      getFeedbackColor(
        percentage(score, quizz.data.questions_count || 0),
        theme
      )
    )
  }, [isAttemptsLoading])

  /**
   * Build the publisher UI in the card.
   * @returns
   */
  const buildPublisher = () => (
    <Tooltip title={`${quizz.user?.firstName} ${quizz.user?.lastName}`}>
      <UserAvatar variant="circular" user={quizz.user as User} />
    </Tooltip>
  )

  /**
   * Build the tags in the card
   * @returns
   */
  const buildTags = () =>
    (displayDraft && (
      <DraftTag size="small" variant="outlined" label={t('card.tags.draft')} />
    )) ||
    (isNew && (
      <NewTag size="small" variant="outlined" label={t('card.tags.new')} />
    ))

  /**
   * Build the creation date in the card
   * @returns
   */
  const buildCreationDate = () => (
    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
      {dayjs(quizz.createdAt).format(t('card.creationDateFormat'))}
    </Typography>
  )

  const buildCommonContent = () => (
    <Stack
      sx={{ width: '100%' }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      {displayTags && buildTags()}
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: '100%', overflow: 'hidden' }}
      >
        {displayPublisher && buildPublisher()}
        <Stack sx={{ width: '100%', overflow: 'hidden' }}>
          <Tooltip title={quizz.name}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
              noWrap={true}
            >
              {displayVisibility && quizz.visibility !== 'public' && (
                <VisibilityIcons visibility={quizz!.visibility!} />
              )}
              {quizz.name}
            </Typography>
          </Tooltip>
          {displayCreationDate && buildCreationDate()}
        </Stack>
      </Stack>
      <Stack alignItems="center" direction="row">
        {displayScoreMethod && (
          <Tooltip
            sx={{ mr: 2 }}
            title={t<string>(
              `help.${quizz.data.keepHighestScore ? 'max' : 'mean'}`
            )}
          >
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={t(
                `forms.create-update.placeholder.modes.${
                  quizz.data.keepHighestScore ? 'max' : 'mean'
                }`
              )}
            />
          </Tooltip>
        )}

        {displayScore && (
          <Box sx={{ width: 70, mr: 2 }}>
            <CircularProgressbar
              value={score}
              maxValue={quizz.data.questions_count || 0}
              text={`${score.toFixed(2)}/${quizz.data.questions_count || 0}`}
              styles={buildStyles({
                trailColor: theme.palette.divider,
                pathColor: color,
                textColor: color,
              })}
            />
          </Box>
        )}

        <Stack direction="row" spacing={2} alignItems="center">
          {displayNumberOfQuestions && (
            <Stack textAlign="center">
              <Typography variant="h5">
                {quizz.data.questions_count || 0}
              </Typography>
              <Typography
                fontSize={12}
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                {'questions'.toUpperCase()}
              </Typography>
            </Stack>
          )}
          {displayCrudOptions && <QuizzSliderOption quizz={quizz} />}
        </Stack>
      </Stack>
    </Stack>
  )

  switch (variant) {
    case 'link':
      return (
        <Link
          underline="none"
          component={RouterLink}
          to={`/quizzes/${quizz.id}/play`}
        >
          <Card
            sx={{ p: 3, position: 'relative', overflow: 'visible' }}
            variant="outlined"
          >
            {buildCommonContent()}
          </Card>
        </Link>
      )
    case 'accordion':
      return (
        <Accordion sx={{ borderRadius: 1 }} variant="outlined">
          <AccordionSummary
            expandIcon={<Icon name="eva:arrow-ios-downward-outline" />}
            sx={{ px: 3, py: 2 }}
          >
            {buildCommonContent()}
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {!isAttemptsLoading &&
                attempts?.data.map((attempt, idx) => (
                  <QuizzAttemptCard quizz={quizz} attempt={attempt} key={idx} />
                ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )
    default:
      return (
        <Card
          sx={{ p: 3, position: 'relative', overflow: 'visible' }}
          variant="outlined"
        >
          {buildCommonContent()}
        </Card>
      )
  }
}
