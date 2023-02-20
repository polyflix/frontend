import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Link,
  Modal,
  Stack,
  Typography,
} from '@mui/material'
import { isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { videoSlugLink } from '@core/helpers/video.helper'
import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'
import { SnackbarService } from '@services/snackbar.service'

import { ReportModel, ReportState } from '@videos/models/report.model'
import { useUpdateReportMutation } from '@videos/services/video.service'

interface Props {
  report?: ReportModel
  onClose: () => void
}

export const ManageReportModal = ({ report, onClose }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [updateReport] = useUpdateReportMutation()
  const { t } = useTranslation('administration')
  const { t: t2 } = useTranslation('videos')

  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  useEffect(() => {
    setOpen(!isUndefined(report))
  }, [report])

  const update = async (state: ReportState) => {
    if (report) {
      const { error } = (await updateReport({
        body: {
          state,
        },
        report,
      })) as any
      if (error) {
        snackbarService.createSnackbar(error.data.message, { variant: 'error' })
      } else {
        handleClose()
      }
    }
  }

  const { Modal: ConfirmModal, onClick: onClickConfirmModal } = useConfirmModal(
    {
      title: `${t('report.page.modal.actions.approve')} ?`,
      content: t('report.page.modal.approve_warning'),
      onCancel: () => {},
      onConfirm: () => {
        update(ReportState.APPROVED)
      },
      acceptLabel: t('report.page.modal.actions.approve'),
    }
  )

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
            <Box>
              <ConfirmModal />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    {report && report.__video__ && (
                      <Stack>
                        <Link
                          underline="none"
                          color="inherit"
                          target="_blank"
                          to={videoSlugLink(report.__video__)}
                          component={RouterLink}
                        >
                          <Typography variant="h4" sx={{ color: 'blue' }}>
                            {report.__video__.title}
                          </Typography>
                        </Link>
                        <Typography variant="caption">
                          {t('report.page.modal.reportFor', {
                            reason: t2(`report.reasons.${report.reason}`),
                          })}
                        </Typography>
                        {report.details && (
                          <Typography variant="body1">
                            {t('report.page.modal.details')} : {report.details}
                          </Typography>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row" justifyContent="end">
                    {report && report.state === 0 ? (
                      <>
                        <Button onClick={onClickConfirmModal} color={'success'}>
                          {t('report.page.modal.actions.approve')}
                        </Button>
                        <Button
                          onClick={() => update(ReportState.REJECTED)}
                          color={'warning'}
                        >
                          {t('report.page.modal.actions.reject')}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => update(ReportState.PENDING)}>
                        {t('report.page.modal.actions.reopen')}
                      </Button>
                    )}
                    <Button onClick={handleClose} variant="outlined">
                      {t('users.form.actions.close')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
