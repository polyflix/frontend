import { Avatar, IconButton, ListItemIcon, Tooltip } from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { SnackbarService } from '@core/services/snackbar.service'

type Props = {
  url: string
  copyToClipboard?: boolean
}

export const AttachmentAvatar = ({ url, copyToClipboard = true }: Props) => {
  const { t: tUsers } = useTranslation('users')
  const { t: tAttachments } = useTranslation('attachments')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const avatarContent = () => (
    <Avatar src={'' /* TODO : Issue #466 */}>
      <Icon name="eva:link-outline" size={30} />
    </Avatar>
  )

  if (copyToClipboard) {
    return (
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
          text={url}
        >
          <Tooltip title={tAttachments<string>('actions.copyToClipboard')}>
            <IconButton>{avatarContent()}</IconButton>
          </Tooltip>
        </CopyToClipboard>
      </ListItemIcon>
    )
  } else {
    return <ListItemIcon>{avatarContent()}</ListItemIcon>
  }
}
