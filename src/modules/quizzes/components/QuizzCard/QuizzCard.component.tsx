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
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Element } from '@core/models/element.model'

import { Quizz } from '@quizzes/models/quizz.model'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'
import { User } from '@users/models/user.model'

import {
  getFeedbackColor,
  getScore,
  percentage,
} from '../../helpers/score.helper'
import { QuizzAttemptCard } from '../QuizzAttemptCard/QuizzAttemptCard.component'
import { NewTag } from './QuizzCard.style'
import { QuizzSliderOption } from './QuizzCardOption.component'

interface Props {
  quizz: Element<Quizz>
  displayCreationDate?: boolean
  displayScoreMethod?: boolean
  displayTags?: boolean
  displayScore?: boolean
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
  displayNumberOfQuestions = true,
  displayPublisher = true,
  displayCrudOptions = false,
  variant = 'link',
}: Props) => {
  const theme = useTheme()
  const { t } = useTranslation('quizzes')

  // We want to label the quizz as new if it was created less of 7 days ago.
  const isNew = Math.abs(dayjs(quizz.createdAt).diff(dayjs(), 'day')) < 7

  const score = getScore(quizz) || 0
  const questions = quizz.data.questions || []
  const color = getFeedbackColor(percentage(score, questions.length), theme)

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
    isNew && (
      <NewTag size="small" variant="outlined" label={t('card.tags.new')} />
    )

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
      <Stack spacing={2} direction="row">
        {displayPublisher && buildPublisher()}
        <Stack>
          <Typography variant="h6" fontWeight="bold">
            {quizz.name}
          </Typography>
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
              maxValue={questions.length}
              text={`${score.toFixed(2)}/${questions.length}`}
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
              <Typography variant="h5">{questions.length}</Typography>
              <Typography
                fontSize={12}
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                {'questions'.toUpperCase()}
              </Typography>
            </Stack>
          )}
          {displayCrudOptions && <QuizzSliderOption id={quizz.id} />}
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
              {quizz.data.attempts?.map((attempt, idx) => (
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
