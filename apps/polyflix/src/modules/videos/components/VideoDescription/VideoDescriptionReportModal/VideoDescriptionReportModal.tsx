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
  Stack,
  Typography,
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@services/snackbar.service'

import { ReportModel, ReportReason } from '@videos/models/report.model'
import { Video } from '@videos/models/video.model'
import { useReportVideoMutation } from '@videos/services/video.service'

interface Props {
  video?: Video
  onClose: () => void
}

export const VideoDescriptionReportModal = ({ video, onClose }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [reportVideo] = useReportVideoMutation()

  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('videos')

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportModel>({
    defaultValues: {
      reason: undefined,
      details: '',
    },
  })

  useEffect(() => setOpen(!isUndefined(video)), [video])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const onSubmit = async (data: ReportModel) => {
    try {
      await reportVideo({ slug: video?.slug || '', body: data })
      reset()
      handleClose()
      snackbarService.createSnackbar(t('report.form.success'), {
        variant: 'success',
      })
    } catch (err) {
      snackbarService.createSnackbar(t('report.form.failure'), {
        variant: 'error',
      })
    }
  }

  return video ? (
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
            <Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      sx={{ marginBottom: 2 }}
                    >
                      {t('report.form.title', { title: video.title })}
                    </Typography>

                    <Controller
                      control={control}
                      name="reason"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="reason">
                            {t('report.form.reason')}
                          </InputLabel>
                          <Select
                            {...field}
                            input={<OutlinedInput label="reason" />}
                            labelId="reason"
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
                                {t(`report.reasons.${selected}`)}
                              </Box>
                            )}
                          >
                            {Object.values(ReportReason).map((v) => (
                              <MenuItem key={v} value={v}>
                                {t(`report.reasons.${v}`)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />

                    <TextField
                      sx={{ marginTop: 2 }}
                      error={Boolean(errors.details)}
                      multiline
                      minRows={5}
                      maxRows={40}
                      required={false}
                      disabled={isSubmitting}
                      label={t('report.form.details')}
                      {...getCommonTextFieldProps()}
                      {...register('details')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack justifyContent="end" spacing={2} direction="row">
                      <Button onClick={handleClose} variant="outlined">
                        {t('report.form.cancel')}
                      </Button>
                      <LoadingButton
                        {...getCommonSubmitButtonProps(isSubmitting, false)}
                      >
                        {t('report.form.submit')}
                      </LoadingButton>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  ) : (
    <></>
  )
}
