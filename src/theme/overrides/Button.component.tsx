import { ComponentsOverrides } from '@mui/material'

export const Button = (): {
  MuiButton: { styleOverrides?: ComponentsOverrides['MuiButton'] }
} => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  }
}
