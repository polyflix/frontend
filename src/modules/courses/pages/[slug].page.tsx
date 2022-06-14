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
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { MarkdownBox } from '@core/components/MarkdownBox/MarkdownBox.component'
import { Page } from '@core/components/Page/Page.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'

import { Course } from '@courses/models/course.model'
import {
  useDeleteCourseMutation,
  useGetCourseQuery,
} from '@courses/services/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

export const CourseSlugPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('courses')
  const history = useHistory()
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const fetchFilters = useMemo<CoursesFilters>(() => ({}), [])
  const { data } = useGetCourseQuery({ slug, filters: fetchFilters })
  const course: Course | undefined = data

  const { user } = useAuth()

  const [deleteCourse] = useDeleteCourseMutation()
  const handleDelete = async () => {
    try {
      await deleteCourse({ slug: course!.slug }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Courses)
      history.push('/users/profile/courses')
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

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
          position: 'relative',
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
          {course?.user?.id === user?.id && (
            <Grid
              sx={{
                position: 'absolute',
                top: 1,
                right: 1,
                margin: 1,
              }}
            >
              <CardMenu
                updateHref={`/courses/${course!.slug}/update`}
                onDelete={handleDelete}
                type="courses"
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <>
            <Stack spacing={2}>
              <Typography variant="h4">{t('collections')}</Typography>
              {course?.modules?.map((module) => (
                <Paper variant="outlined" key={module.id} sx={{ p: 2 }}>
                  <Link
                    component={RouterLink}
                    to={`/modules/${module.slug}`}
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
                      {module.name}
                    </Typography>
                  </Link>
                  <CollectionTimeline collectionSlug={module.slug} />
                </Paper>
              ))}
            </Stack>
            {course?.modules?.length === 0 && (
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
