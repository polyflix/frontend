import { useSwitch, UseSwitchProps } from '@mui/core/SwitchUnstyled'
import { useTheme } from '@mui/material'
import clsx from 'clsx'
import * as React from 'react'
import { useContext } from 'react'

import { ColorModeContext } from '@theme/theme'

import {
  SwitchRoot,
  SwitchTrack,
  SwitchInput,
  SwitchThumb,
} from './ThemeButton.style'

function MUISwitch(props: UseSwitchProps) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props)
  const theme = useTheme()

  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  }

  return (
    <SwitchRoot className={clsx(stateClasses)}>
      <SwitchTrack theme={theme}>
        <SwitchThumb theme={theme} className={clsx(stateClasses)} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} />
    </SwitchRoot>
  )
}

export const ThemeButton: React.FC = () => {
  const { mode, toggleColorMode } = useContext(ColorModeContext)

  const handleChange = () => {
    toggleColorMode()
  }

  return (
    <MUISwitch
      onChange={handleChange}
      checked={mode === 'light' ? false : true}
    />
  )
}
