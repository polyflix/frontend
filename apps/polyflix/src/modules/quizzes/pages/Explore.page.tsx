import { Add } from '@mui/icons-material'
import { Box, Button, Divider, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { useRoles } from '@core/hooks/useRoles.hook'
import { Visibility } from '@types_/resources/content.type'
import { Element } from '@types_/resources/element.type'
import { Role } from '@types_/roles.type'
import { buildSkeletons } from '@core/utils/gui.utils'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { QuizzCardSkeleton } from '@quizzes/components/QuizzCardSkeleton/QuizzCardSkeleton.component'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@services/resources/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'
import { polyflixRouter } from '@routes/index'

export const ExploreQuizzesPage = () => {
  const { t } = useTranslation('quizzes')
  let params = new URLSearchParams(window.location.search)

  // Useful states for filtering purposes
  const [filters, setFilters] = useState<QuizzFilters>({
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  // Fetch the quizzes
  const { data, isLoading, isFetching } = useGetQuizzesQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

  const { hasRoles } = useRoles()
  const quizzes: Element<Quizz>[] = data?.data || []
  const skeletons = buildSkeletons(3)

  return (
    <Page isLoading={isLoading} title={t('explore.title')}>
      <Header
        title={t('explore.title')}
        description={t('explore.description')}
        hideActionButton={!hasRoles([Role.Admin, Role.Contributor])}
        actionButton={
          <Button
            variant="contained"
            startIcon={<Add />}
            component={RouterLink}
            to={polyflixRouter().studio.quizzes.create}
          >
            {t('explore.actions.create')}
          </Button>
        }
      />

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        {/* <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: { $or: [...buildQuizzSearch(search)] },
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
              <Grid key={quizz.id} item xs={12} md={4}>
                <QuizzCard displayTags quizz={quizz} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} md={4}>
                <QuizzCardSkeleton key={i} />
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
        <NoData
          variant="quizzes"
          link={polyflixRouter().studio.quizzes.create}
        />
      )}
    </Page>
  )
}
