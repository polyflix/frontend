import {
  Alert,
  Avatar,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { MarkdownBox } from '@core/components/MarkdownBox/MarkdownBox.component'
import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'
import { CollectionTimelineSkeleton } from '@collections/components/CollectionTimelineSkeleton/CollectionTimelineSkeleton.component'

import { Course } from '@courses/models/course.model'
import { useGetCourseQuery } from '@courses/services/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

export const CourseSlugPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('courses')
  const { user } = useAuth()
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
  const { data, isLoading } = useGetCourseQuery({ slug, filters: fetchFilters })
  const course: Course | undefined = data

  return (
    <Page title={course?.name}>
      <Grid
        container
        spacing={4}
        sx={{
          backgroundColor: 'grey.300',
          borderRadius: 2,
          mt: 1,
          pb: 4,
        }}
      >
        <Grid item xs={12} md={8} sx={{ minHeight: '250px' }}>
          <Stack>
            {data?.name ? (
              <Typography
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer',
                  overflowWrap: 'break-word',
                }}
                variant="h2"
              >
                {data.name}
                {user?.id && data?.user?.id === user.id && (
                  <Tooltip title={`${t('form.upsert.update')}`}>
                    <IconButton
                      sx={{
                        display: 'inline',
                        margin: 1,
                        color: 'primary.light',
                      }}
                      component={RouterLink}
                      to={`/courses/${data?.slug}/update`}
                    >
                      <Icon name="eva:edit-fill" />
                    </IconButton>
                  </Tooltip>
                )}
              </Typography>
            ) : (
              <Skeleton variant="text" width="50%" height="50px" />
            )}

            {data?.description ? (
              <Typography
                variant={'body1'}
                sx={{ color: 'grey.700', overflowWrap: 'break-word', py: 2 }}
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

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <>
            <Typography variant="h4">{t('collections')}</Typography>
            {course?.collections?.map((collection) => (
              <Stack
                key={collection.id}
                sx={{
                  border: 1,
                  borderColor: 'grey.400',
                  backgroundColor: 'grey.300',
                  borderRadius: 1,
                  p: 2,
                  my: 2,
                }}
              >
                <Typography
                  component={RouterLink}
                  variant="h4"
                  sx={{
                    my: 1,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: 'black',
                    width: 'auto',
                  }}
                  to={`collections/${collection.slug}`}
                >
                  {collection.name}
                </Typography>
                <CollectionTimeline collectionSlug={collection.slug} />
              </Stack>
            ))}
            {course?.collections?.length === 0 && (
              <Alert severity="info">{t('noData')}</Alert>
            )}
          </>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Typography variant="h4">{t('introduction')}</Typography>
          <MarkdownBox body={data?.content} />
        </Grid>
      </Grid>
    </Page>
  )
}
