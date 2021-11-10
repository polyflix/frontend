import {
  Button,
  Paper,
  Stack,
  Typography,
  Modal as ConfirmationModal,
  Fade,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type UseConfirmModalProps = {
  onConfirm?: () => void
  onCancel?: () => void
  title: string
  content: string
}
type UseConfirmModalReturnProps = {
  onClick: () => void
  Modal: () => JSX.Element
}

export const useConfirmModal = ({
  title,
  content,
  onCancel,
  onConfirm,
}: UseConfirmModalProps): UseConfirmModalReturnProps => {
  const { t } = useTranslation('')
  const [isOpen, setOpen] = useState(false)
  const onClick = () => setOpen(!isOpen)

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    setOpen(false)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    setOpen(false)
  }

  const Modal = () => (
    <ConfirmationModal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
      open={isOpen}
      onBackdropClick={handleCancel}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Fade in={isOpen}>
        <Paper
          sx={{
            p: 2,
            py: 3,
            minWidth: {
              xs: 100,
              sm: 400,
            },
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5" component="h2">
                {title}
              </Typography>
              <Typography variant="body1" component="h2">
                {content}
              </Typography>
            </Stack>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="end"
              alignItems="center"
            >
              <Button onClick={handleCancel}>
                {t('confirmationModal.actions.cancel')}
              </Button>
              <Button variant="contained" color="error" onClick={handleConfirm}>
                {t('confirmationModal.actions.delete')}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </ConfirmationModal>
  )

  return { Modal, onClick }
}
