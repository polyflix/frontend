import { Divider, Pagination, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'

import { QuizzAttemptsList } from '@quizzes/components/QuizzAttemptsList/QuizzAttemptsList.component'
import { useGetAttemptsQuery } from '@quizzes/services/attempt.service'
import { useGetQuizzQuery } from '@quizzes/services/quizz.service'
import { QuizzAttemptFilters } from '@quizzes/types/filters.type'

const getSearchByName = (value: string) => [
  {
    'user.firstName': {
      $contL: value,
    },
  },
  {
    'user.lastName': {
      $contL: value,
    },
  },
]

export const QuizzResultsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('quizzes')

  const [filters, setFilters] = useState<QuizzAttemptFilters>({})

  const { data: quizz, isLoading: isQuizzLoadingding } = useGetQuizzQuery({
    id,
    filters: {
      join: ['questions', { field: 'user', select: ['firstName', 'lastName'] }],
    },
  })

  const { data: attempts, isLoading: isAttemptsLoading } = useGetAttemptsQuery({
    id,
    filters: {
      join: [
        {
          field: 'user',
          select: ['firstName', 'lastName'],
        },
      ],
      ...filters,
    },
  })

  return (
    <Page
      title={t('results.title', { quizzName: quizz?.name })}
      isLoading={isQuizzLoadingding || isAttemptsLoading}
    >
      <Header
        title={t('results.title', { quizzName: quizz?.name })}
        description={t('results.description')}
      />
      <Divider sx={{ my: 3 }} />
      <Stack justifyContent="space-between" direction="row">
        <Searchbar
          onChange={(value) =>
            setFilters({
              ...filters,
              search: { $or: [...getSearchByName(value)] },
            })
          }
          label={t('results.search')}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>
      <QuizzAttemptsList attempts={attempts?.data} quizz={quizz} />
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={attempts?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Page>
  )
}
