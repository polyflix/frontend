import {
  alpha,
  Color,
  PaletteColor,
  PaletteMode,
  PaletteOptions,
} from '@mui/material'

const GREY: Color = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#dfe3e8',
  400: '#c4cdd5',
  500: '#919eab',
  600: '#637381',
  700: '#454f5b',
  800: '#212b36',
  900: '#161c24',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161',
}

const PRIMARY: PaletteColor = {
  light: '#ff5740',
  main: '#e50914',
  dark: '#aa0000',
  contrastText: '#ffffff',
}
const SECONDARY: PaletteColor = {
  light: '#ffdfb0',
  main: '#faad80',
  dark: '#c47d53',
  contrastText: '#000000',
}
const INFO: PaletteColor = {
  light: '#6ec0ff',
  main: '#1890ff',
  dark: '#0063cb',
  contrastText: '#000000',
}
const SUCCESS: PaletteColor = {
  light: '#8dff62',
  main: '#54d62c',
  dark: '#00a300',
  contrastText: '#000000',
}
const WARNING: PaletteColor = {
  light: '#fff350',
  main: '#ffc107',
  dark: '#c79100',
  contrastText: '#000000',
}
const ERROR: PaletteColor = {
  light: '#ff5131',
  main: '#d50000',
  dark: '#9b0000',
  contrastText: '#ffffff',
}

const getPalette: (mode: PaletteMode) => PaletteOptions = (
  mode: PaletteMode
) => ({
  common: { black: '#000000', white: '#ffffff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  divider: mode === 'light' ? GREY[200] : '#161c24',
  ...(mode === 'light'
    ? {
        background: { paper: '#ffffff', default: '#fafafa' },
        text: { primary: GREY[900], secondary: GREY[700], disabled: GREY[500] },
      }
    : {
        background: { paper: '#292929', default: '#121212' },
        text: {
          primary: '#FFFFFF',
          secondary: alpha('#FFFFFF', 0.6),
          disabled: alpha('#FFFFFF', 0.38),
        },
      }),
  action: {
    ...(mode === 'light'
      ? {
          active: '#0000008a',
          hover: '#0000000a',
        }
      : {
          active: GREY[400],
          hover: '#363636',
        }),
    hoverOpacity: 0.03,
    selected: '#00000014',
    selectedOpacity: 0.08,
    disabled: '#00000042',
    disabledOpacity: 0.38,
    disabledBackground: '#0000001f',
    focus: '#0000001f',
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
  },
  mode,
  contrastThreshold: 2,
  tonalOffset: 0,
})

export default getPalette
