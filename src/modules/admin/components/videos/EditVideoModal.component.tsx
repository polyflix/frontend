import { LoadingButton } from '@mui/lab'
import { Backdrop, Box, Fade, Modal, Stack, Typography } from '@mui/material'
import { isUndefined } from 'lodash'
import { useEffect, useState } from 'react'

import { getCommonSubmitButtonProps } from '@core/helpers/form.helper'

import { Video } from '@videos/models/video.model'

interface Props {
  video?: Video
}

export const EditVideoModal = ({ video }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  useEffect(() => setOpen(!isUndefined(video)), [video])

  const isSubmitting = false

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            maxWidth: '700px',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
            p: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              p: 2,
              borderRadius: 1,
              boxShadow: 10,
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row">
              <Typography variant="h4">{video?.title}</Typography>
            </Stack>

            <Stack alignItems="end">
              <LoadingButton
                {...getCommonSubmitButtonProps(isSubmitting, false)}
              >
                Save
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
