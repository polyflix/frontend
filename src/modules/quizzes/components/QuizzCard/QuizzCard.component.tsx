import { Avatar, Box, Card, Stack, Tooltip, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Quizz } from '@quizzes/models/quizz.model'

import { NewTag } from './QuizzCard.style'

interface Props {
  quizz: Quizz
}

// Component used to display a quizz in the UI
export const QuizzCard = ({ quizz }: Props) => {
  const { t } = useTranslation('quizzes')

  // We want to label the quizz as new if it was created less of 7 days ago.
  const isNew = Math.abs(dayjs(quizz.createdAt).diff(dayjs(), 'day')) < 7

  return (
    <Box
      sx={{ textDecoration: 'none' }}
      component={RouterLink}
      to={`/quizzes/${quizz.id}/play`}
    >
      <Card
        sx={{ p: 3, position: 'relative', overflow: 'visible' }}
        variant="outlined"
      >
        {isNew && (
          <NewTag size="small" variant="outlined" label={t('card.tags.new')} />
        )}

        <Stack direction="row" spacing={2}>
          <Tooltip title={`${quizz.user?.firstName} ${quizz.user?.lastName}`}>
            <Avatar variant="circular" src={quizz.user?.profilePicture} />
          </Tooltip>
          <Box>
            <Typography fontWeight="bold">{quizz.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {dayjs(quizz.createdAt).format(t('card.creationDateFormat'))}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}
