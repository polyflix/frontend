import { MembersList } from '@admin/components/groups/MembersList.component'
import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import {
  useDeleteGroupMutation,
  useGetGroupQuery,
} from '@admin/services/group.service'
import { Delete, Edit, Groups, InfoRounded } from '@mui/icons-material'
import {
  List,
  ListItem,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  Typography,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { AsyncListItemText } from '@core/components/AsyncListItem/AsyncListItem.component'
import { AsyncText } from '@core/components/AsyncText/AsyncListItem.component'
import { UserName } from '@core/components/UserName/UserName.component'
import { Endpoint } from '@constants/endpoint.constant'
import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

export const AdminViewGroupPage = () => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('administration')
  const { data: group } = useGetGroupQuery(slug)
  const [deleteGroup] = useDeleteGroupMutation()

  const history = useHistory()

  const onDelete = async () => {
    try {
      await deleteGroup({
        id: group!.id,
      })

      snackbarService.notify(CrudAction.DELETE, Endpoint.Groups)

      history.push('/admin/groups')
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
      pageTitle={group?.name}
      action={
        <Stack direction="row" spacing={2}>
          <Button
            component={RouterLink}
            to={`/admin/groups/update/${group?.slug}`}
            startIcon={<Edit />}
            variant="outlined"
          >
            {t('groups.page.actions.edit')}
          </Button>
          <Tooltip title={t<string>('groups.page.actions.delete')}>
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
                      <InfoRounded />
                    </ListItemIcon>
                    <AsyncListItemText
                      primary={t<string>('groups.view.groupName')}
                      secondary={group?.name}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Groups />
                    </ListItemIcon>
                    <AsyncListItemText
                      primary={t<string>('groups.view.countMembers')}
                      secondary={group?.members?.length}
                    />
                  </ListItem>
                </List>
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
              <Stack direction="column" alignItems="center">
                <Typography gutterBottom variant="h5">
                  {t('groups.view.groupOwner')}
                </Typography>
                <Avatar
                  alt={`${group?.owner?.firstName} ${group?.owner?.lastName}`}
                  src={group?.owner.avatar}
                  sx={{ mb: 2, width: 60, height: 60 }}
                />
                <UserName
                  firstName={group?.owner?.firstName}
                  lastName={group?.owner?.lastName}
                />
                <AsyncText
                  value={group?.owner?.email}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: '200px',
                  }}
                />
                {group?.owner?.roles?.map((role: string, index: number) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    color="primary"
                    label={t(`roles.${role.toLocaleLowerCase()}`, {
                      ns: 'common',
                    })}
                    size="small"
                    sx={{
                      mt: 2,
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
        <Card variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5">
              {t('groups.view.groupMembers')}
            </Typography>
            <MembersList members={group?.members || []} />
          </CardContent>
        </Card>
      </Stack>
      <Modal />
    </AdminLayout>
  )
}
