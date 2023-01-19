import { ComponentsOverrides, Theme } from '@mui/material'

export const Typography = (
  theme: Theme
): {
  MuiTypography: { styleOverrides?: ComponentsOverrides['MuiTypography'] }
} => {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  }
}
