import { ComponentsOverrides, Theme } from '@mui/material'

export const Avatar = (
  theme: Theme
): {
  MuiAvatar: { styleOverrides?: ComponentsOverrides['MuiAvatar'] }
} => {
  return {
    MuiAvatar: {
      styleOverrides: {
        rounded: {
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  }
}
