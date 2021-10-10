import { CSSObject } from '@mui/system'

export const fadeInAnnimation = (
  state: boolean,
  duration = 500
): CSSObject => ({
  transition: state ? `opacity ease ${duration}ms` : 'none',
  opacity: state ? 1 : 0,
})
