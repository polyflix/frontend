import { Container, Fade, Modal, Paper, SxProps, Theme } from '@mui/material'

import { Attachment } from '@attachments/models/attachment.model'

import { AttachmentForm } from './AttachmentForm.component'

type AttachmentModalProps = {
  attachment?: Attachment
  sx?: SxProps<Theme>
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

export const AttachmentModal = ({
  attachment,
  sx: sxProps,
  open,
  onClose,
  onSubmit,
}: AttachmentModalProps) => {
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
          <Container
            sx={{ display: 'flex', justifyContent: 'center', my: '1em' }}
          >
            <AttachmentForm attachment={attachment} closeOnSubmit={onSubmit} />
          </Container>
        </Paper>
      </Fade>
    </Modal>
  )
}
