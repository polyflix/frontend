import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import { PropsWithChildren, useMemo } from 'react'

import { breakpoints } from './breakpoints'
import { ComponentsOverrides } from './overrides'
import palette from './palette.config'
import shadows from './shadows.config'
import { shape } from './shapes'
import { typography } from './typography.config'

export const ThemeConfig: React.FC = ({ children }: PropsWithChildren<{}>) => {
  const themeOptions = useMemo<ThemeOptions>(
    () => ({
      palette,
      shape,
      shadows,
      typography,
      breakpoints,
    }),
    []
  )

  const theme = createTheme(themeOptions)
  theme.components = ComponentsOverrides(theme)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
