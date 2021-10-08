import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import React, { PropsWithChildren, useMemo } from 'react'

export const ThemeConfig = ({ children }: PropsWithChildren<{}>) => {
  const themeOptions = useMemo<ThemeOptions>(() => ({}), [])

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
