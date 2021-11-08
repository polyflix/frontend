import { Box, Grid, Pagination, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'

import { CourseCard } from '@courses/components/CourseCard/CourseCard.component'
import { useGetCoursesQuery } from '@courses/services/course.service'

export const ExploreCoursesPage = () => {
  const { t } = useTranslation('courses')

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    join: [
      {
        field: 'user',
        select: ['firstName', 'lastName', 'avatar'],
      },
      {
        field: 'collections',
        select: ['slug'],
      },
    ],
  })

  const { data, isLoading } = useGetCoursesQuery(filters)

  return (
    <Page title={t('explore.title')} isLoading={isLoading}>
      <Grid container spacing={3}>
        <Grid item xs={11} sm={11} md={7}>
          <Stack spacing={3}>
            <Typography variant="h1">
              <Trans
                i18nKey="explore.bodyTitle"
                ns={'courses'}
                components={{
                  colored: (
                    <Box component={'div'} sx={{ color: 'primary.light' }} />
                  ),
                }}
              />
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: '400', color: 'text.secondary' }}
            >
              {t('explore.description')}
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={1} />
        {data &&
          data.data.map((course) => (
            <Grid item xs={4} md={4} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
      </Grid>
      <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
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
