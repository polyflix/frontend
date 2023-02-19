import { IconButton } from '@mui/material'
import { SnackbarKey, useSnackbar } from 'notistack'
import { forwardRef } from 'react'
import CloseIcon from '@mui/icons-material/Close'

type DefaultSnackBarProps = {
  key: SnackbarKey
}

// eslint-disable-next-line react/display-name
export const CloseSnackbarButton = forwardRef<
  HTMLButtonElement,
  DefaultSnackBarProps
>((props, ref) => {
  const { closeSnackbar } = useSnackbar()
  return (
    <IconButton
      ref={ref}
      onClick={() => closeSnackbar(props.key)}
      color="inherit"
    >
      <CloseIcon />
    </IconButton>
  )
})
