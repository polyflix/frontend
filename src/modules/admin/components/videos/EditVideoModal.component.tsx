import { AdminVideoForm, Draft } from '@admin/types/video.type'
import { LoadingButton } from '@mui/lab'
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Stack
 } from '@mui/material'
import { isUndefined } from 'lodash'
import { GetDerivedStateFromError, useEffect, useState } from 'react'

import { useUpdateVideoMutation } from '@videos/services/video.service'

import { getCommonSubmitButtonProps } from '@core/helpers/form.helper'
import { Visibility } from '@core/models/content.model'
import { Video } from '@videos/models/video.model'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SnackbarService } from '@core/services/snackbar.service'
import { useInjection } from '@polyflix/di'
import { IVideoForm } from '@videos/types/form.type'

interface Props {
  video?: Video
}


export const EditVideoModal = ({ video }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [updateVideo] = useUpdateVideoMutation()
  const { t } = useTranslation('administration')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
  } = useForm<AdminVideoForm>({
    defaultValues: {
      title: video?.title,
      visibility: video?.visibility ?? "protected" as Visibility,
      draft: 'true' as Draft, //video?.draft?.toString() as Draft,
      availableLanguages: video?.availableLanguages,
    },
  })


  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  const onSubmit = async (data: AdminVideoForm) => {
    const body = { ...video, ...data }
    console.log('body:', body)

    // map body to IVideoForm

    const { error } = (await updateVideo({
      slug: video!.slug,
      body: body,
    })) as any
    if (error) {
      snackbarService.createSnackbar(error.data.message, { variant: 'error' })
    } else {
      handleClose()
    }
  }

  useEffect(() => setOpen(!isUndefined(video)), [video])

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
          <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row">

            <Controller
                      control={control}
                      name="visibility"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="visibility">Visibility</InputLabel>
                          <Select
                            {...field}
                            input={<OutlinedInput label="Visibility" />}
                            labelId="visibility"
                            required
                            minRows={1}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected}
                              </Box>
                            )}
                          >
                            {Object.values(Visibility).map((v) => (
                              <MenuItem key={v} value={v}>
                                {v}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
          </Stack>
          <Stack direction="row">
            <Controller
                      control={control}
                      name="draft"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="draft">Draft</InputLabel>
                          <Select
                            {...field}
                            input={<OutlinedInput label="draft" />}
                            labelId="draft"
                            required
                            minRows={1}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected}
                              </Box>
                            )}
                          >
                            {Object.values(Draft).map((v) => (
                              <MenuItem key={v} value={v}>
                                {v}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
          </Stack>
                    <Stack justifyContent="end" spacing={2} direction="row">
                      <Button onClick={handleClose} variant="outlined">
                        {t('users.form.actions.close')}
                      </Button>
                      <LoadingButton
                        {...getCommonSubmitButtonProps(isSubmitting, false)}
                      >
                        {t('users.form.actions.save')}
                      </LoadingButton>
                    </Stack>
                    </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
