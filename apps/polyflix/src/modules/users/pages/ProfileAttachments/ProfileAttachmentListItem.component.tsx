import {
  Avatar,
  IconButton,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
} from '@mui/material'

import { Icon } from '@core/components/Icon/Icon.component'

import { AttachmentAvatar } from '@attachments/components/AttachmentAvatar.component'
import { Attachment } from '@attachments/models/attachment.model'

import { AttachmentListMenu } from '@users/components/AttachmentListMenu/AttachmentListMenu.component'

type Props = {
  attachment: Attachment
  onDelete: () => void
}
export const ProfileAttachmentListItem = ({ attachment, onDelete }: Props) => {
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
      <AttachmentAvatar url={attachment.url} />
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
