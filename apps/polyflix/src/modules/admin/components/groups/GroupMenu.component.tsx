import { Group } from '@admin/models/group.model'
import { useDeleteGroupMutation } from '@admin/services/group.service'
import { InfoOutlined } from '@mui/icons-material'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@constants/endpoint.constant'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

interface PropsGroupMenu {
  group: Group
}
export const GroupMenu = ({ group }: PropsGroupMenu) => {
  const { t } = useTranslation('administration')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [deleteGroup] = useDeleteGroupMutation()

  const handleDelete = async () => {
    try {
      await deleteGroup({
        id: group!.id,
      })
      snackbarService.notify(CrudAction.DELETE, Endpoint.Groups)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/admin/groups/update/${group.slug}`}
      onDelete={handleDelete}
      publisherId={group?.owner.id}
      type="videos"
    >
      <MenuItem component={RouterLink} to={`/admin/groups/${group?.slug}`}>
        <ListItemIcon>
          <InfoOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>{t('groups.page.actions.info')}</ListItemText>
      </MenuItem>
    </CardMenu>
  )
}
