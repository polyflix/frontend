import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import { PropsWithChildren, useMemo } from 'react'

import { typography } from './typography'

export const ThemeConfig = ({ children }: PropsWithChildren<{}>) => {
  const themeOptions = useMemo<ThemeOptions>(
    () => ({
      typography,
    }),
    []
  )

  const theme = createTheme(themeOptions)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
