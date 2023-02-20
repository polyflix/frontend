import { Add } from '@mui/icons-material'
import { Box, Button, Divider, Grid } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@types_/roles.type'
import { buildSkeletons } from '@core/utils/gui.utils'

import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'

import { CourseCard } from '@courses/components/CourseCard/CourseCard.component'
import { Course } from '@courses/models/course.model'
import { useGetCoursesQuery } from '@courses/services/course.service'
import { polyflixRouter } from '@routes/index'

export const ExploreCoursesPage = () => {
  const { t } = useTranslation('courses')
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState({
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
    draft: false,
  })

  const { data, isLoading, isFetching } = useGetCoursesQuery(filters)

  const { hasRoles } = useRoles()
  const courses: Course[] = data?.data ?? []
  const skeletons = buildSkeletons(3)

  let totalPage = Math.ceil((data?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page title={t('explore.title')} isLoading={isLoading}>
      <Header
        title={t('explore.title')}
        description={t('explore.description')}
        hideActionButton={!hasRoles([Role.Admin, Role.Contributor])}
        actionButton={
          <Button
            variant="contained"
            startIcon={<Add />}
            component={RouterLink}
            to={polyflixRouter().studio.courses.create}
          >
            {t('explore.actions.create')}
          </Button>
        }
      />
      <Divider sx={{ my: 3 }} />

      <Grid sx={{ my: 3 }} container spacing={3}>
        {!isFetching
          ? courses.map((course: Course) => (
              <Grid item xs={12} sm={6} lg={4} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {courses.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={totalPage}
          />
        </Box>
      ) : (
        <NoData
          variant="courses"
          link={polyflixRouter().studio.courses.create}
        />
      )}
    </Page>
  )
}
