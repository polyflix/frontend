import {
  Backdrop,
  Box,
  Fade,
  LinearProgress,
  LinearProgressProps,
  Modal,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '@core/store'

const LinearProgressWithLabel = ({
  value,
  ...props
}: LinearProgressProps & { value: number }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {value}%
        </Typography>
      </Box>
    </Box>
  )
}

// Component that should be displayed when an upload is in progress
export const UploadProgress = () => {
  const { t } = useTranslation()

  const { isUploading, progress } = useSelector(
    ({ upload }: RootState) => upload
  )

  return (
    <Modal
      open={isUploading}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isUploading}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 350, md: 550 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 10,
            p: 4,
          }}
        >
          <Typography variant="h5">{t('uploadInProgress')}</Typography>
          <LinearProgressWithLabel value={progress!} />
        </Box>
      </Fade>
    </Modal>
  )
}
