import { LoadingButton } from '@mui/lab'
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { SnackbarService } from '@core/services/snackbar.service'

import { useDeleteQuizzMutation } from '@quizzes/services/quizz.service'

interface Props {
  id: string
  open: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onClose: () => void
}

// Component used in the quizz form to delete a quizz
export const DeleteQuizzModal = ({ id, open, onClose, setIsOpen }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('quizzes')

  // Get our delete mutation
  const [deleteQuizz] = useDeleteQuizzMutation()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteQuizz({ id }).unwrap()
      snackbarService.createSnackbar(t('forms.delete.success'), {
        variant: 'success',
      })
    } catch (e: any) {
      snackbarService.createSnackbar(e.message, { variant: 'error' })
    } finally {
      setIsSubmitting(false)
      setIsOpen(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '50%' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 10,
            p: 4,
          }}
        >
          <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="h4">
              {t('forms.delete.modal.title')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('forms.delete.modal.description')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsOpen(false)}>
              {t('forms.delete.action.cancel')}
            </Button>
            <LoadingButton
              size="large"
              variant="contained"
              loading={isSubmitting}
              onClick={handleDelete}
            >
              {t('forms.delete.action.delete')}
            </LoadingButton>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  )
}
