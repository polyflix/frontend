import { GlobalStyles as GlobalThemeStyles } from '@mui/material'

export const GlobalStyles = () => {
  return (
    <GlobalThemeStyles
      styles={{
        'vm-player': {
          display: 'flex',
          width: '100%',
          height: '100%',
        },
      }}
    />
  )
}
