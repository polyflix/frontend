import { Close } from '@mui/icons-material'
import {
  Box,
  Container,
  Fade,
  Modal,
  Paper,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useGetAttachmentQuery } from '@attachments/services/attachment.service'

import { AttachmentForm } from './AttachmentForm.component'

type AttachmentModalProps = {
  attachmentId?: string
  sx?: SxProps<Theme>
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

export const AttachmentModal = ({
  attachmentId,
  sx: sxProps,
  open,
  onClose,
  onSubmit,
}: AttachmentModalProps) => {
  /* We only fetch the attachment if an ID is provided */
  const { data: attachment } = useGetAttachmentQuery(
    { id: attachmentId || '' },
    {
      skip: !attachmentId,
    }
  )

  const { t } = useTranslation('attachments')

  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        ...sxProps,
      }}
      keepMounted={false}
      open={open}
      onClose={onClose}
      aria-labelledby="element modal"
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: {
              xl: '40%',
              lg: '50%',
              md: '60%',
              sm: '80%',
              xs: '100%',
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
          <Container sx={{ my: '0.25em' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h4">
                {t(
                  `forms.create-update.title.${
                    attachmentId ? 'update' : 'create'
                  }`
                )}
              </Typography>
              <Tooltip title={t<string>('closeModal')}>
                <Close sx={{ cursor: 'pointer' }} onClick={() => onClose()} />
              </Tooltip>
            </Box>
            {/* Display the form when attachment is fetched (in edit mode) */}
            {((attachmentId && attachment) || !attachmentId) && (
              <AttachmentForm
                attachment={attachment}
                closeOnSubmit={onSubmit}
              />
            )}
          </Container>
        </Paper>
      </Fade>
    </Modal>
  )
}
