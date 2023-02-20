import { CertificatesList } from '@admin/components/certifications/CertificatesList.component'
import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import { Announcement, Assignment, Delete, Edit } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { AsyncListItemText } from '@core/components/AsyncListItem/AsyncListItem.component'
import { Endpoint } from '@constants/endpoint.constant'
import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

import {
  useDeleteCertificationMutation,
  useGetCertificationQuery,
} from '@certifications/services/certification.service'

export const AdminViewCertificationPage = () => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('administration')
  const { data: certification } = useGetCertificationQuery({ id: slug })
  const [deleteCertification] = useDeleteCertificationMutation()

  const history = useHistory()

  const onDelete = async () => {
    try {
      await deleteCertification({
        id: certification!.id!,
      })

      snackbarService.notify(CrudAction.DELETE, Endpoint.Certifications)

      history.push('/admin/certifications')
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  const { Modal, onClick: onClickModal } = useConfirmModal({
    title: t('groups.deleteModal.title'),
    content: t('groups.deleteModal.content'),
    onCancel: () => {},
    onConfirm: () => onDelete(),
  })

  return (
    <AdminLayout
      pageTitle={certification?.name}
      action={
        <Stack direction="row" spacing={2}>
          <Button
            component={RouterLink}
            to={`/admin/certifications/update/${certification?.id}`}
            startIcon={<Edit />}
            variant="outlined"
          >
            {t('certifications.page.actions.edit')}
          </Button>
          <Tooltip title={t<string>('certifications.page.actions.delete')}>
            <IconButton color="primary" onClick={onClickModal}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      <Stack spacing={1} direction="column" sx={{ width: '100%' }}>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
              <Stack direction="column" alignItems="start">
                <Typography gutterBottom variant="h5">
                  {t('groups.view.generalInfo')}
                </Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <AsyncListItemText
                      primary={t<string>('certifications.form.labels.name')}
                      secondary={certification?.name}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Announcement />
                    </ListItemIcon>
                    <AsyncListItemText
                      primary={t<string>(
                        'certifications.form.labels.certificationID'
                      )}
                      secondary={certification?.id}
                    />
                  </ListItem>
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
        <Card variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5">
              {t('certifications.page.certificate.title')}
            </Typography>
            {certification && (
              <CertificatesList certification={certification} />
            )}
          </CardContent>
        </Card>
      </Stack>
      <Modal />
    </AdminLayout>
  )
}
