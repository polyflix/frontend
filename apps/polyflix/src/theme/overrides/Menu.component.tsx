import { ComponentsOverrides, Theme } from '@mui/material'

export const Menu = (
  theme: Theme
): {
  MuiMenu: { styleOverrides?: ComponentsOverrides['MuiMenu'] }
  MuiMenuItem: { styleOverrides?: ComponentsOverrides['MuiMenuItem'] }
} => {
  return {
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: '8px',
          boxSizing: 'border-box',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  }
}
