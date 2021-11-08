import { Box, Pagination, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { Element } from '@core/models/element.model'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

// This component displays the user quizzes history.
export const QuizzesHistoryPage = () => {
  const { t } = useTranslation('quizzes')
  const { user } = useAuth()

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({})

  const { data, isLoading } = useGetQuizzesQuery({
    join: [
      'attempts',
      'questions',
      { field: 'attempts.user', select: ['firstName', 'lastName'] },
      { field: 'user', select: ['firstName', 'lastName'] },
    ],
    sort: [{ field: 'attempts.createdAt', order: 'DESC' }],
    page: filters.page || 1,
    limit: filters.limit || 10,
    'element.draft': false,
    'attempts.user': user?.id,
  })

  return (
    <Page isLoading={isLoading} title={t('history.title')}>
      <Header
        title={t('history.title')}
        description={t('history.description')}
      />

      <Stack justifyContent="end" direction="row">
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>

      <Stack sx={{ my: 3 }} spacing={2}>
        {data?.data.map((quizz: Element<Quizz>) => (
          <QuizzCard
            variant="accordion"
            displayScore
            displayScoreMethod
            displayNumberOfQuestions={false}
            displayTags={false}
            key={quizz.id}
            quizz={quizz}
          />
        ))}
      </Stack>

      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={data?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Page>
  )
}
