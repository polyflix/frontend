import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { Element } from '@types_/resources/element.type'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { QuizzCardSkeleton } from '@quizzes/components/QuizzCardSkeleton/QuizzCardSkeleton.component'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@services/resources/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

// This component displays the user quizzes history.
export const QuizzesHistoryPage = () => {
  const { t } = useTranslation('quizzes')
  const { user } = useAuth()

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({})

  const {
    data: quizzes,
    isLoading,
    isFetching,
  } = useGetQuizzesQuery({
    page: filters.page || 1,
    pageSize: filters.pageSize || 10,
    draft: false,
    userId: user?.id,
    isDone: true,
  })

  const skeletons = buildSkeletons(3)

  return (
    <Page isLoading={isLoading} title={t('history.title')}>
      <Header
        title={t('history.title')}
        description={t('history.description')}
      />

      <Stack justifyContent="end" direction="row">
        {/* If there is more than 10 items, we display a limit item per page selector */}
        {quizzes?.total! > 10 && (
          <ItemsPerPage
            onChange={(pageSize) => setFilters({ ...filters, pageSize })}
          />
        )}
      </Stack>

      <Stack sx={{ my: 3 }} spacing={2}>
        {!isFetching ? (
          quizzes && quizzes?.data.length > 0 ? (
            quizzes?.data.map((quizz: Element<Quizz>) => (
              <QuizzCard
                variant="accordion"
                displayScore
                displayScoreMethod
                displayNumberOfQuestions={false}
                displayTags={false}
                displayVisibility
                key={quizz.id}
                quizz={quizz}
              />
            ))
          ) : (
            <NoData creatable={false} />
          )
        ) : (
          skeletons.map((_, i: number) => <QuizzCardSkeleton key={i} />)
        )}
      </Stack>

      <Box display="flex" justifyContent="center">
        <PaginationSynced
          filters={filters}
          setFilters={setFilters}
          pageCount={quizzes?.pageCount!}
        />
      </Box>
    </Page>
  )
}
