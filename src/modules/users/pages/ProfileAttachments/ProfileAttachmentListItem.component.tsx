import {
  Avatar,
  IconButton,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Tooltip,
} from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { SnackbarService } from '@core/services/snackbar.service'

import { Attachment } from '@attachments/models/attachment.model'

import { AttachmentListMenu } from '@users/components/AttachmentListMenu/AttachmentListMenu.component'

type Props = {
  attachment: Attachment
  onDelete: () => void
}
export const ProfileAttachmentListItem = ({ attachment, onDelete }: Props) => {
  const { t: tUsers } = useTranslation('users')
  const { t: tAttachments } = useTranslation('attachments')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  return (
    <ListItem
      secondaryAction={
        <AttachmentListMenu
          attachment={attachment}
          onDelete={() => onDelete()}
        />
      }
      component={Paper}
      variant="outlined"
      sx={{ mb: 1 }}
    >
      <ListItemIcon>
        <CopyToClipboard
          onCopy={() => {
            snackbarService.createSnackbar(
              tUsers('profile.tabs.attachments.content.list.clipboard'),
              {
                variant: 'success',
              }
            )
          }}
          text={attachment.url}
        >
          <Tooltip title={tAttachments<string>('actions.copyToClipboard')}>
            <IconButton>
              <Avatar src={'' /* TODO : Issue #466 */}>
                <Icon name="eva:link-outline" size={30} />
              </Avatar>
            </IconButton>
          </Tooltip>
        </CopyToClipboard>
      </ListItemIcon>
      <Link
        href={attachment.url}
        target="_blank"
        rel="noopener"
        color="inherit"
        underline="hover"
      >
        <ListItemText primary={attachment.title} />
      </Link>
    </ListItem>
  )
}

export const ProfileAttachmentSkeleton = () => {
  return (
    <ListItem component={Paper} variant="outlined" sx={{ mb: 1 }}>
      <ListItemIcon>
        <IconButton>
          <Avatar>
            <Icon name="eva:link-outline" size={30} />
          </Avatar>
        </IconButton>
      </ListItemIcon>
      <Skeleton variant="text" width="100%" />
    </ListItem>
  )
}
