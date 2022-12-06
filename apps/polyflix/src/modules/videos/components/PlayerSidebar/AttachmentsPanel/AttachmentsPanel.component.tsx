import { Alert, Link, List, ListItem, ListItemText } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'

import { Video } from '@videos/models/video.model'

import { AttachmentAvatar } from '@attachments/components/AttachmentAvatar.component'
import { useGetVideoAttachmentsQuery } from '@attachments/services/attachment.service'

interface AttachmentPanelProps {
  video: Video
}

export const AttachmentsPanel = ({ video }: AttachmentPanelProps) => {
  const { t } = useTranslation('videos')

  const { data: attachments, refetch } = useGetVideoAttachmentsQuery(video.id)

  useEffect(() => {
    /* Since the attachments are not invalidated after a video update, we need to refetch them here */
    if (attachments) refetch()
  }, [])

  const content = () => {
    return attachments && attachments.items.length === 0 ? (
      <ListItem>
        <Alert severity="info" sx={{ width: '100%' }}>
          {t('slug.sidebar.tabs.attachments.alertMessages.info')}
        </Alert>
      </ListItem>
    ) : (
      attachments?.items.map((attachment) => (
        <ListItem
          key={attachment.id}
          sx={{ bgcolor: 'background.default', borderRadius: 1, mb: 1 }}
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
      ))
    )
  }

  return (
    <AutoScrollBox>
      <List dense={true}>{content()}</List>
    </AutoScrollBox>
  )
}
