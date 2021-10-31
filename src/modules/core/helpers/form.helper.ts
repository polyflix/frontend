import { LoadingButtonProps } from '@mui/lab'
import { TextFieldProps } from '@mui/material'
import i18n from 'i18next'

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

/**
 * Generate a validation schema for useFormHook password fields
 */
export const buildPasswordValidation = () => ({
  required: {
    value: true,
    message: i18n.t('auth:fields.required'),
  },
  minLength: {
    value: 8,
    message: i18n.t('auth:fields.minLength', { count: 8 }),
  },
  maxLength: {
    value: 64,
    message: i18n.t('auth:fields.maxLength', { count: 8 }),
  },
})
