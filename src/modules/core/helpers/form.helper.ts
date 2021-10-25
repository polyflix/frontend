import { LoadingButtonProps } from '@mui/lab'
import { TextFieldProps } from '@mui/material'

export const getCommonTextFieldProps = (): TextFieldProps => ({
  variant: 'outlined',
  fullWidth: true,
})

export const getCommonSubmitButtonProps = (
  isLoading: boolean
): LoadingButtonProps => ({
  fullWidth: true,
  size: 'large',
  type: 'submit',
  variant: 'contained',
  loading: isLoading,
})
