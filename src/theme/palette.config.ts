import { Color } from '@mui/material'
import { alpha, PaletteColor, PaletteOptions } from '@mui/material/styles'

const GREY: Color = {
  50: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  A100: alpha('#919EAB', 0.08),
  A200: alpha('#919EAB', 0.12),
  A400: alpha('#919EAB', 0.16),
  A700: alpha('#919EAB', 0.25),
}

const PRIMARY: PaletteColor = {
  light: '#ff453c',
  main: '#E50914',
  dark: '#cb0000',
  contrastText: '#fff',
}
const SECONDARY: PaletteColor = {
  light: '#FBBD99',
  main: '#FAAD80',
  dark: '#AF7959',
  contrastText: '#fff',
}
const INFO: PaletteColor = {
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  contrastText: '#fff',
}
const SUCCESS: PaletteColor = {
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  contrastText: GREY[800],
}
const WARNING: PaletteColor = {
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  contrastText: GREY[800],
}
const ERROR: PaletteColor = {
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  contrastText: '#fff',
}

const palette: PaletteOptions = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  divider: GREY.A700,
  text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
  background: { paper: '#fff', default: '#F9FAFB' },
  action: {
    active: GREY[600],
    hover: GREY.A700,
    hoverOpacity: 0.08,
    selected: GREY.A400,
    selectedOpacity: 0.1,
    disabled: GREY.A400,
    disabledOpacity: 0.48,
    disabledBackground: GREY.A700,
    focus: GREY.A700,
    focusOpacity: 0.09,
    activatedOpacity: 0.09,
  },
  mode: 'light',
  contrastThreshold: 0,
  tonalOffset: 0,
}

export default palette
