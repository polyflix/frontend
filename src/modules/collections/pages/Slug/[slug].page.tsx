import { Delete, Edit, PlayArrow } from '@mui/icons-material'
import {
  Button,
  Fab,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useParams } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { FabActionContainer } from '@core/components/FabActionContainer/FabActionContainer.component'
import { Page } from '@core/components/Page/Page.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { useRoles } from '@core/hooks/useRoles.hook'
import { useSearchQuery } from '@core/hooks/useSearchQuery.hook'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'
import { Role } from '@core/types/roles.type'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'
import {
  useDeleteCollectionMutation,
  useGetCollectionQuery,
} from '@collections/services/collection.service'
import { CollectionFilters } from '@collections/types/filters.type'

export const CollectionSlugPage = () => {
  const accessKey = useSearchQuery('accessKey')
  const { t } = useTranslation('collections')
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { hasRoles } = useRoles()
  const requiredRoles = [Role.Teacher, Role.Admin]

  const [deleteCourse] = useDeleteCollectionMutation()

  const filters = useMemo<CollectionFilters>(
    () => ({
      join: [{ field: 'elements' }],
    }),
    []
  )

  const { data, isLoading, error } = useGetCollectionQuery({
    slug: slug,
    accessKey,
    filters,
  })

  const handleDelete = async () => {
    try {
      await deleteCourse({ slug: data!.slug }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Collections)
      history.push('/users/profile/collections')
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  return (
    <Page error={error} isLoading={isLoading}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, pb: 4 }}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography variant="h3">{data?.name}</Typography>
                <Typography variant="body1">{data?.description}</Typography>
              </Stack>
              <Button
                variant="outlined"
                disabled={data?.elements?.length === 0}
                startIcon={<PlayArrow />}
                component={Link}
                to={
                  data?.elements
                    ? `/videos/${data?.elements[0]?.slug}?c=${data?.slug}&index=0`
                    : ''
                }
              >
                {t('slug.actions.play')}
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="h4">{t('slug.list.title')}</Typography>
              <CollectionTimeline collectionSlug={data?.slug} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      {data && hasRoles(requiredRoles) && (
        <FabActionContainer>
          <Fab
            color="primary"
            aria-label="add"
            size="medium"
            onClick={handleDelete}
          >
            <Delete />
          </Fab>
          <Fab
            color="secondary"
            aria-label="edit"
            size="medium"
            component={Link}
            to={`/collections/${data.slug}/update`}
          >
            <Edit />
          </Fab>
        </FabActionContainer>
      )}
    </Page>
  )
}
