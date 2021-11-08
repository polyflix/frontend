import { Container, Divider, Pagination, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { QuizzCardSkeleton } from '@quizzes/components/QuizzCardSkeleton/QuizzCardSkeleton.component'
import { buildQuizzSearch } from '@quizzes/helpers/search.helper'
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

export const ProfileQuizzesPage = () => {
  const { user } = useAuth()
  const { t } = useTranslation('users')

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: 1,
    limit: 10,
  })

  const { data: quizzes, isFetching } = useGetQuizzesQuery({
    join: [
      { field: 'element.user', select: ['firstName', 'lastName'] },
      'questions',
    ],
    'element.user.id': user?.id,
    ...filters,
  })

  const skeletons = buildSkeletons(4)

  return (
    <Container disableGutters={true} maxWidth={false} sx={{ mt: 3 }}>
      <Header
        title={t('profile.tabs.quizzes.content.title')}
        description={t('profile.tabs.quizzes.content.description')}
      />
      <Divider sx={{ my: 3 }} />
      <Stack justifyContent="space-between" direction="row">
        <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: {
                $and: [
                  ...buildQuizzSearch(search),
                  {
                    'element.user.id': user?.id,
                  },
                ],
              },
            })
          }}
          label={t('navbar.actions.search.fast', { ns: 'common' })}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>
      <Grid sx={{ my: 3 }} container spacing={2}>
        {!isFetching ? (
          quizzes?.data && quizzes?.data.length > 0 ? (
            quizzes?.data.map((item) => (
              <Grid key={item.id} item xs={12} lg={6}>
                <QuizzCard
                  variant="none"
                  displayCrudOptions
                  displayPublisher={false}
                  displayTags
                  displayScoreMethod
                  quizz={item}
                />
              </Grid>
            ))
          ) : (
            <NoData variant="quizzes" link="/quizzes/create" />
          )
        ) : (
          skeletons.map((_, i: number) => (
            <Grid key={i} item xs={12} lg={6}>
              <QuizzCardSkeleton />
            </Grid>
          ))
        )}
      </Grid>
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={quizzes?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  )
}
