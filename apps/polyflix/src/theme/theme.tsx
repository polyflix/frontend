import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PaletteMode } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { breakpoints } from './breakpoints'
import { ComponentsOverrides } from './overrides'
import getPalette from './palette.config'
import { shape } from './shapes'
import { typography } from './typography.config'

export const ColorModeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
})

export const ThemeConfig: React.FC = ({ children }: PropsWithChildren<{}>) => {
  const [mode, setMode] = useState<PaletteMode>('light')

  useEffect(() => {
    let m = localStorage.getItem('mode')
    if (m) setMode(m as PaletteMode)
    else localStorage.setItem('mode', mode)
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          let m = prevMode === 'light' ? 'dark' : 'light'
          localStorage.setItem('mode', m)
          return m as PaletteMode
        })
      },
    }),
    []
  )

  const themeOptions = useMemo<ThemeOptions>(
    () => ({
      palette: getPalette(mode),
      shape,
      typography,
      breakpoints,
    }),
    [mode]
  )

  const theme = createTheme(themeOptions)
  theme.components = ComponentsOverrides(theme)

  return (
    <ColorModeContext.Provider value={{ mode, ...colorMode }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </ColorModeContext.Provider>
  )
}
