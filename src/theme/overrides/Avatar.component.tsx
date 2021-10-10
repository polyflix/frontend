import { ComponentsOverrides, Theme } from '@mui/material'

export const Avatar = (
  theme: Theme
): {
  MuiAvatar: { styleOverrides?: ComponentsOverrides['MuiAvatar'] }
} => {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  }
}
