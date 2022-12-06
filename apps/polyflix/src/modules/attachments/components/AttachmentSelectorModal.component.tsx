import {
  Box,
  Button,
  Checkbox,
  Container,
  Fade,
  Link,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Paper,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { UseFieldArrayReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import { NoData } from '@core/components/NoData/NoData.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { IVideoForm } from '@videos/types/form.type'

import { Attachment } from '@attachments/models/attachment.model'
import { AttachmentParams } from '@attachments/models/attachment.params'
import { useGetUserAttachmentsQuery } from '@attachments/services/attachment.service'

import { AttachmentAvatar } from './AttachmentAvatar.component'

interface Props {
  attachments: UseFieldArrayReturn<IVideoForm, 'attachments'>
  videoId?: string
  isOpen: boolean
  onClose: () => void
  sx?: SxProps<Theme>
}
export const AttachmentSelectorModal = ({
  attachments,
  videoId,
  isOpen,
  onClose,
  sx: sxProps,
}: Props) => {
  const { user } = useAuth()
  const { t } = useTranslation('attachments')

  const [page] = useState(1)

  const [filters, setFilters] = useState<AttachmentParams>({
    page,
    pageSize: 10,
    userId: user!.id,
  })

  const { data, isLoading, refetch } = useGetUserAttachmentsQuery(filters)

  const { fields, append, remove } = attachments

  const handleToggle = (attachment: Attachment) => () => {
    const currentIndex = fields.findIndex((e) => e.id === attachment.id)
    if (currentIndex === -1) {
      append(attachment)
    } else {
      remove(currentIndex)
    }
  }

  useEffect(() => {
    /* Since the attachments are not invalidated after a video update, we need to refetch them here */
    if (data) refetch()
  }, [])

  useEffect(() => {
    /* On update mode, append the previously selected attachments in order to set the checkboxes ticked */
    if (videoId && data) {
      for (const f of fields) {
        if (
          f.videos.includes(videoId) &&
          !fields.find(({ id }) => id === f.id)
        ) {
          append(f)
        }
      }
    }
  }, [videoId, data])

  const isAttachmentSelected = (attachment: Attachment) =>
    fields.some((e) => e.id === attachment.id)

  /* If the user has no attachment, he is redirected to the attachment creation form */
  if (data && data.totalCount === 0)
    return <Redirect push to="/users/profile/attachments/create" />

  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        ...sxProps,
      }}
      open={isOpen}
      onClose={() => onClose()}
      aria-labelledby="element modal"
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Paper
          sx={{
            width: {
              lg: '40%',
              md: '50%',
              sm: '70%',
              xs: '90%',
            },
            bgcolor: 'background.default',
            borderRadius: 2,
            p: {
              sm: 2,
              xs: 1,
            },
          }}
          variant="outlined"
        >
          <Typography variant="h4" sx={{ mb: '2%' }}>
            {t('forms.selector.title')}
          </Typography>
          <Scrollbar
            sx={{
              maxHeight: (theme) => `calc(100vh - ${theme.spacing(30)})`,
              minHeight: '300px',
            }}
          >
            <Box sx={{ mt: 2 }}>
              {{ data }
                ? data?.items.map((item) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(item)}
                          checked={isAttachmentSelected(item)}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton onClick={handleToggle(item)}>
                        <AttachmentAvatar url={item.url} />
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener"
                          color="inherit"
                          underline="hover"
                        >
                          <ListItemText primary={item.title} />
                        </Link>
                      </ListItemButton>
                    </ListItem>
                  ))
                : buildSkeletons(3)}
            </Box>
          </Scrollbar>
          <Stack spacing={0}>
            {!isLoading &&
              (data &&
              data.items.length > 0 &&
              data.items.length < data.totalCount ? (
                <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
                  <PaginationSynced
                    filters={filters}
                    setFilters={setFilters}
                    pageCount={Math.ceil(data?.totalCount / filters.pageSize)}
                  />
                </Box>
              ) : (
                !data ||
                (data.items.length === 0 && (
                  <NoData
                    variant="attachments"
                    link="/users/profile/attachments/create"
                  />
                ))
              ))}
          </Stack>
          <Container
            sx={{ display: 'flex', justifyContent: 'center', my: '1em' }}
          >
            <Button onClick={onClose} variant="contained">
              {t('forms.selector.validate')}
            </Button>
          </Container>
        </Paper>
      </Fade>
    </Modal>
  )
}
