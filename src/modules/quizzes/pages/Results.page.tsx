import { Divider, Pagination, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { QuizzAttemptsList } from '@quizzes/components/QuizzAttemptsList/QuizzAttemptsList.component'
import { useGetAttemptsQuery } from '@quizzes/services/attempt.service'
import { useGetQuizzQuery } from '@quizzes/services/quizz.service'
import { QuizzAttemptFilters } from '@quizzes/types/filters.type'

export const QuizzResultsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('quizzes')

  const [filters, setFilters] = useState<QuizzAttemptFilters>({})

  const {
    data: quizz,
    isLoading: isQuizzLoading,
    isFetching: isQuizzFetching,
  } = useGetQuizzQuery({
    id,
  })

  const {
    data: attempts,
    isLoading: isAttemptsLoading,
    isFetching: isAttemptsFetching,
  } = useGetAttemptsQuery({
    id,
    filters: filters,
  })

  return (
    <Page
      title={t('results.title', { quizzName: quizz?.name })}
      isLoading={isQuizzLoading || isAttemptsLoading}
    >
      <Header
        title={t('results.title', { quizzName: quizz?.name })}
        description={t('results.description')}
      />
      <Divider sx={{ my: 3 }} />
      <Stack justifyContent="space-between" direction="row">
        {/* <Searchbar
          onChange={(value) =>
            setFilters({
              ...filters,
              search: { $or: [...getSearchByName(value)] },
            })
          }
          label={t('results.search')}
        /> */}
        <ItemsPerPage
          onChange={(pageSize) => setFilters({ ...filters, pageSize })}
        />
      </Stack>
      <QuizzAttemptsList
        attempts={attempts?.data}
        quizz={quizz}
        isQuizzFetching={isQuizzFetching}
        isAttemptsFetching={isAttemptsFetching}
      />
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
