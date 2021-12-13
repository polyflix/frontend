import {
  Alert,
  Avatar,
  Divider,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { MarkdownBox } from '@core/components/MarkdownBox/MarkdownBox.component'
import { Page } from '@core/components/Page/Page.component'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'

import { Course } from '@courses/models/course.model'
import { useGetCourseQuery } from '@courses/services/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

export const CourseSlugPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('courses')
  const fetchFilters = useMemo<CoursesFilters>(
    () => ({
      join: [
        {
          field: 'user',
          select: ['firstName', 'fullName', 'lastName', 'avatar'],
        },
        {
          field: 'collections',
          select: ['slug', 'elements', 'name'],
        },
      ],
    }),
    []
  )
  const { data } = useGetCourseQuery({ slug, filters: fetchFilters })
  const course: Course | undefined = data

  return (
    <Page title={course?.name}>
      <Paper
        variant="outlined"
        sx={{
          px: {
            xs: 1,
            sm: 3,
          },
          py: {
            xs: 2,
            sm: 4,
          },
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={8} sx={{ minHeight: '250px' }}>
            <Stack>
              {data?.name ? (
                <Typography
                  sx={{
                    overflowWrap: 'break-word',
                  }}
                  variant="h2"
                >
                  {data.name}
                </Typography>
              ) : (
                <Skeleton variant="text" width="50%" height="50px" />
              )}

              {data?.description ? (
                <Typography
                  variant={'body1'}
                  sx={{ overflowWrap: 'break-word', py: 2 }}
                >
                  {data.description}
                </Typography>
              ) : (
                <>
                  <Skeleton variant="text" width="85%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="70%" />
                </>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }}>
              {course?.user?.avatar ? (
                <Avatar
                  sx={{ width: '100px', height: '100px', margin: 'auto' }}
                  variant="square"
                  src={course.user.avatar}
                />
              ) : (
                <Skeleton
                  sx={{
                    borderRadius: '8px',
                    height: '100px',
                    width: '100px',
                    margin: 'auto',
                  }}
                  animation="wave"
                  variant="rectangular"
                />
              )}
              {course?.user?.firstName && course?.user?.lastName ? (
                <Typography sx={{ textAlign: 'center' }} variant={'h5'}>
                  {course.user.firstName} {course.user.lastName}
                </Typography>
              ) : (
                <Skeleton
                  sx={{
                    borderRadius: '8px',
                    height: '15px',
                    width: '40%',
                    marginX: 'auto',
                  }}
                  animation="wave"
                  variant="rectangular"
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <>
            <Stack spacing={2}>
              <Typography variant="h4">{t('collections')}</Typography>
              {course?.collections?.map((collection) => (
                <Paper variant="outlined" key={collection.id} sx={{ p: 2 }}>
                  <Link
                    component={RouterLink}
                    to={`collections/${collection.slug}`}
                    underline="none"
                    color="inherit"
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        my: 1,
                        width: 'auto',
                      }}
                    >
                      {collection.name}
                    </Typography>
                  </Link>
                  <CollectionTimeline collectionSlug={collection.slug} />
                </Paper>
              ))}
            </Stack>
            {course?.collections?.length === 0 && (
              <Alert severity="info">{t('noData.empty')}</Alert>
            )}
          </>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Typography variant="h4">{t('introduction')}</Typography>
          <MarkdownBox body={data?.content!} />
        </Grid>
      </Grid>
    </Page>
  )
}
