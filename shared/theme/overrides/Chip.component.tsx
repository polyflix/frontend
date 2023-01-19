import { ComponentsOverrides } from '@mui/material'

export const Chip = (): {
  MuiChip: { styleOverrides?: ComponentsOverrides['MuiChip'] }
} => {
  return {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  }
}
