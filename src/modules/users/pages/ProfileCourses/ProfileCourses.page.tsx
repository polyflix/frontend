import {
  Box,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Page } from '@core/components/Page/Page.component'
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
  const [filters, setFilters] = useState<CoursesFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],

    page: 1,
    limit: 10,
  })

  const { data, isLoading, isFetching } = useGetCoursesQuery({
    join: [{ field: 'collections', select: ['slug'] }, { field: 'user' }],
    'user.id': user!.id,
    ...filters,
  })

  const skeletons = buildSkeletons(3)

  return (
    <Page isLoading={isLoading} title={t('explore.title')} sx={{ mt: 3 }}>
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
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>

      <Grid sx={{ my: 3 }} container columnSpacing={2} rowSpacing={4}>
        {!isFetching
          ? data?.data.map((item: Course) => (
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
