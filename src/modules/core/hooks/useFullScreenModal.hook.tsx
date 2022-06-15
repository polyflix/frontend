/* eslint-disable react/prop-types */

/* eslint-disable react/display-name */
import { Close } from '@mui/icons-material'
import {
  Dialog as FullScreenModal,
  Box,
  IconButton,
  Toolbar,
  Slide,
  Tooltip,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type UseFullScreenModalProps = {
  onClose?: () => void
}
type UseFullScreenModalReturnProps = {
  openModal: () => void
  Modal: React.FC
  close: () => void
}

export const useFullScreenModal = ({
  onClose,
}: UseFullScreenModalProps): UseFullScreenModalReturnProps => {
  const { t } = useTranslation('common')
  const [isOpen, setOpen] = useState(false)
  const openModal = () => setOpen(!isOpen)

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setOpen(false)
  }

  const Modal: React.FC = useMemo(
    () =>
      ({ children }) =>
        (
          <FullScreenModal
            sx={{
              width: '100%',
              p: {
                xs: 0,
                sm: 2,
                md: 4,
              },
              'div.MuiDialog-paper': {
                borderRadius: {
                  xs: 0,
                  sm: 1,
                },
              },
            }}
            fullScreen
            TransitionComponent={Transition}
            open={isOpen}
            onClose={handleClose}
          >
            <Toolbar
              variant="dense"
              sx={{
                pt: 1,
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Tooltip title={t<string>('actions.closeModal')}>
                <IconButton
                  type="button"
                  color="inherit"
                  onClick={() => setOpen(false)}
                  aria-label="close"
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Toolbar>
            <Box sx={{ p: 2 }}>{children}</Box>
          </FullScreenModal>
        ),
    [isOpen]
  )

  return { Modal, openModal, close: handleClose }
}
