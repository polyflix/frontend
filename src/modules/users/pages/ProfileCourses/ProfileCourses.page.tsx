import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'

import { CourseCard } from '@courses/components/CourseCard/CourseCard.component'
import { Course } from '@courses/models/course.model'
import { useGetCoursesQuery } from '@courses/services/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

export const ProfileCoursesPage = () => {
  const { t } = useTranslation('users')
  const { user } = useAuth()
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<CoursesFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: parseInt(params.get('page') || '1'),
    limit: 10,
  })

  const { data, isLoading, isFetching } = useGetCoursesQuery({
    join: [{ field: 'collections', select: ['slug'] }, { field: 'user' }],
    'user.id': user!.id,
    ...filters,
  })

  const courses: Course[] = data?.data || []
  const skeletons = buildSkeletons(3)

  return (
    <Page
      isLoading={isLoading}
      title={t('profile.tabs.courses.content.title')}
      sx={{ mt: 3 }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('profile.tabs.courses.content.title')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: {
                $and: [
                  [
                    {
                      name: {
                        $contL: search,
                      },
                    },
                  ],
                  {
                    'user.id': {
                      $eq: user!.id,
                    },
                  },
                ],
              },
            })
          }}
          label={t('navbar.actions.search.fast', { ns: 'common' })}
        />

        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(limit) => setFilters({ ...filters, limit, page: 1 })}
          />
        )}
      </Stack>

      <Grid sx={{ my: 3 }} container columnSpacing={2} rowSpacing={4}>
        {!isFetching
          ? courses.map((item: Course) => (
              <Grid key={item.id} item xs={12} sm={6} md={6} lg={4}>
                <CourseCard course={item} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {courses.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={data?.pageCount!}
          />
        </Box>
      ) : (
        <NoData variant="courses" link="/courses/create" />
      )}
    </Page>
  )
}
