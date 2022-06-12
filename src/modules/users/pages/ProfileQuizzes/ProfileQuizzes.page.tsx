import { Divider, Link, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { Visibility } from '@core/models/content.model'
import { Element } from '@core/models/element.model'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { QuizzCardSkeleton } from '@quizzes/components/QuizzCardSkeleton/QuizzCardSkeleton.component'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

export const ProfileQuizzesPage = () => {
  const { user } = useAuth()
  const { t } = useTranslation('users')
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetQuizzesQuery({
    visibility: Visibility.PRIVATE,
    draft: true,
    userId: user?.id,
    ...filters,
  })

  const quizzes: Element<Quizz>[] = data?.data || []
  const skeletons = buildSkeletons(4)

  return (
    <Page
      disableGutters={true}
      sx={{ mt: 3 }}
      title={t('profile.tabs.quizzes.content.title')}
    >
      <Stack justifyContent="space-between" direction="row">
        <Header
          title={t('profile.tabs.quizzes.content.title')}
          description={t('profile.tabs.quizzes.content.description')}
        />
        <Link
          underline="none"
          component={RouterLink}
          color="inherit"
          to="/quizzes/history"
        >
          {t('profile.actions.history')}
        </Link>
      </Stack>
      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        {/* <Searchbar
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
        /> */}

        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(pageSize) =>
              setFilters({ ...filters, pageSize, page: 1 })
            }
          />
        )}
      </Stack>

      <Grid sx={{ my: 3 }} container spacing={2}>
        {!isFetching
          ? quizzes.map((quizz: Element<Quizz>) => (
              <Grid key={quizz.id} item xs={12} lg={6}>
                <QuizzCard
                  variant="none"
                  displayCrudOptions
                  displayPublisher={false}
                  displayTags
                  displayScoreMethod
                  displayDraft
                  displayVisibility
                  quizz={quizz}
                />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} lg={6}>
                <QuizzCardSkeleton />
              </Grid>
            ))}
      </Grid>

      {quizzes.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={data?.pageCount!}
          />
        </Box>
      ) : (
        !isLoading && <NoData variant="quizzes" link="/quizzes/create" />
      )}
    </Page>
  )
}
