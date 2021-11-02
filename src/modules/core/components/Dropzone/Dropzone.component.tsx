import { Paper, Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { SnackbarService } from '@core/services/snackbar.service'

interface Props {
  onAcceptedFiles: (acceptedFiles: File[]) => void
  /**
   * The text which will be displayed in the component.
   */
  text?: string
  /**
   * The text which will be displayed when the user drag hover the component.
   */
  activeText?: string
  multiple?: boolean
  disabled?: boolean
  hint?: boolean
  /**
   * A string or an array of the accepted files format.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   */
  accept?: string | string[]
}

// Component used by forms to upload files
export const Dropzone = ({
  multiple = false,
  disabled = false,
  hint = false,
  accept,
  activeText,
  onAcceptedFiles,
  text,
}: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('dropzone')

  const onDrop = useCallback(
    (acceptedFiles, fileRejections: FileRejection[]) => {
      onAcceptedFiles(acceptedFiles)
      fileRejections.forEach(({ errors }) => {
        errors.forEach(({ code }) => {
          snackbarService.createSnackbar(t(`errors.${code}`), {
            variant: 'error',
          })
        })
      })
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop,
    multiple,
    disabled,
  })

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        cursor: 'pointer',
        borderColor: (theme) => theme.palette.grey[400],
        background: (theme) => theme.palette.grey[100],
        '&:hover': {
          borderColor: (theme) => theme.palette.grey[700],
        },
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Stack justifyContent="center" alignItems="center" textAlign="center">
        <Icon size={30} name="bi:cloud-upload" />
        <Typography sx={{ mt: 1 }} variant="body1">
          {isDragActive
            ? activeText || t('dragActive')
            : text || t('dragInactive')}
        </Typography>
        {hint && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('hint', { accept })}
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
