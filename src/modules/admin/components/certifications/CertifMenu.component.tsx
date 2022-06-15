import { InfoOutlined } from '@mui/icons-material'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Certification } from '@certifications/models/certification.model'
import { useDeleteCertificationMutation } from '@certifications/services/certification.service'

interface PropsCertificationMenu {
  certification: Certification
}
export const CertifMenu = ({ certification }: PropsCertificationMenu) => {
  const { t } = useTranslation('administration')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [deletecertification] = useDeleteCertificationMutation()

  const handleDelete = async () => {
    try {
      await deletecertification({
        id: certification!.id!,
      })
      snackbarService.notify(CrudAction.DELETE, Endpoint.Certifications)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/admin/certifications/update/${certification.id}`}
      onDelete={handleDelete}
      publisherId={certification?.id}
      type="videos"
    >
      <MenuItem
        component={RouterLink}
        to={`/admin/certifications/${certification?.id}`}
      >
        <ListItemIcon>
          <InfoOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>{t('certifications.page.actions.info')}</ListItemText>
      </MenuItem>
    </CardMenu>
  )
}
