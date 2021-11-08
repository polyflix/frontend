import { Theme } from '@mui/material'

export const ease = (theme: Theme, propsName: string | string[]) =>
  theme.transitions.create(propsName, {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
