import { Cursus } from '@cursus/models/cursus.model'
import {
  useDeleteCursusMutation,
  useGetCursusQuery,
} from '@cursus/services/cursus.service'
import { CursusFilters } from '@cursus/types/filters.type'
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
import { Page } from '@core/components/Page/Page.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'

export const CursusSlugPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('cursus')
  const history = useHistory()
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const fetchFilters = useMemo<CursusFilters>(() => ({}), [])
  const { data } = useGetCursusQuery({ slug, filters: fetchFilters })
  const cursus: Cursus | undefined = data

  const { user } = useAuth()

  const [deleteCursus] = useDeleteCursusMutation()
  const handleDelete = async () => {
    try {
      await deleteCursus({ slug: cursus!.slug }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Cursus)
      history.push('/users/profile/cursus')
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  return (
    <Page title={cursus?.title}>
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
              {data?.title ? (
                <Typography
                  sx={{
                    overflowWrap: 'break-word',
                  }}
                  variant="h2"
                >
                  {data.title}
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
              {cursus?.user?.avatar ? (
                <Avatar
                  sx={{ width: '100px', height: '100px', margin: 'auto' }}
                  variant="square"
                  src={cursus.user.avatar}
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
              {cursus?.user?.firstName && cursus?.user?.lastName ? (
                <Typography sx={{ textAlign: 'center' }} variant={'h5'}>
                  {cursus.user.firstName} {cursus.user.lastName}
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
          {cursus?.user?.id === user?.id && (
            <Grid
              sx={{
                position: 'absolute',
                top: 1,
                right: 1,
                margin: 1,
              }}
            >
              <CardMenu
                updateHref={`/cursus/${cursus!.slug}/update`}
                onDelete={handleDelete}
                type="cursus"
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
              {cursus?.courses?.map((course) => (
                <Paper variant="outlined" key={course.id} sx={{ p: 2 }}>
                  <Link
                    component={RouterLink}
                    to={`/courses/${course.slug}`}
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
                      {course.name}
                    </Typography>
                  </Link>
                  <CollectionTimeline collectionSlug={course.slug} />
                </Paper>
              ))}
            </Stack>
            {cursus?.courses?.length === 0 && (
              <Alert severity="info">{t('noData.empty')}</Alert>
            )}
          </>
        </Grid>
      </Grid>
    </Page>
  )
}
