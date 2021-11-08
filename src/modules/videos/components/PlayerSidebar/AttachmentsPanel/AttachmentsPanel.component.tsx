import {
  Alert,
  Avatar,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { Icon } from '@core/components/Icon/Icon.component'

import { getDomain } from '@videos/helpers/favicon.helper'
import { Attachment } from '@videos/models/attachment.model'

interface AttachmentPanelProps {
  attachments: Attachment[]
}

export const AttachmentsPanel = ({
  attachments = [],
}: AttachmentPanelProps) => {
  const { t } = useTranslation('videos')

  const content = () => {
    return attachments.length === 0 ? (
      <ListItem>
        <Alert severity="info" sx={{ width: '100%' }}>
          {t('slug.sidebar.tabs.attachments.alertMessages.info')}
        </Alert>
      </ListItem>
    ) : (
      attachments.map((attachment) => (
        <ListItem key={attachment.id}>
          <Alert severity="info" icon={false} sx={{ width: '100%' }}>
            <Link
              href={attachment.url}
              target="_blank"
              rel="noopener"
              color="inherit"
              underline="hover"
            >
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Avatar src={`${getDomain(attachment.url)}/favicon.ico`}>
                  <Icon name="akar-icons:link-chain" size={30} />
                </Avatar>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {attachment.label}
                </Typography>
              </Stack>
            </Link>
          </Alert>
        </ListItem>
      ))
    )
  }

  return (
    <AutoScrollBox>
      <List dense={true}>{content()}</List>
    </AutoScrollBox>
  )
}
