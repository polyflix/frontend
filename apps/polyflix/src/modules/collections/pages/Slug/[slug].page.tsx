import { Delete, Edit, PlayArrow } from '@mui/icons-material'
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useParams } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Page } from '@core/components/Page/Page.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'
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
  const filters = useMemo<CollectionFilters>(() => ({}), [])

  const { data, isLoading, error } = useGetCollectionQuery({
    slug: slug,
    accessKey,
    filters,
  })

  const { hasRoles } = useRoles()
  const requiredRoles = [Role.Contributor, Role.Admin]

  const [deleteCourse] = useDeleteCollectionMutation()

  const handleDelete = async () => {
    try {
      await deleteCourse({ slug: data!.slug }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Modules)
      history.push('/users/profile/modules')
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  const { Modal: ConfirmModal, onClick: onClickModal } = useConfirmModal({
    title: t('deleteModal.title'),
    content: t('deleteModal.content'),
    onCancel: () => {},
    onConfirm: () => handleDelete(),
  })

  return (
    <>
      <Page error={error} isLoading={isLoading}>
        {data && hasRoles(requiredRoles) && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="end"
            sx={{
              mb: 2,
            }}
          >
            <Button
              component={Link}
              to={`/modules/${data.slug}/update`}
              startIcon={<Edit />}
              variant="outlined"
            >
              {t('slug.actions.edit')}
            </Button>
            <Tooltip title={t<string>('slug.actions.delete')}>
              <IconButton color="primary" onClick={onClickModal}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
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
      </Page>
      <ConfirmModal />
    </>
  )
}
