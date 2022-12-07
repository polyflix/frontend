import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { PropsWithChildren } from 'react'

import { RootStyle, WrapperStyle } from './AspectRation.style'

type AspectRatioBoxProps = {
  ratio?: number
  sx?: SxProps<Theme>
}

export const AspectRatioBox: React.FC<PropsWithChildren<AspectRatioBoxProps>> =
  ({ ratio = 1, children, sx }) => {
    return (
      <RootStyle sx={{ ...sx }}>
        <WrapperStyle>{children}</WrapperStyle>
        <div style={{ paddingBottom: (1 / ratio) * 100 + '%' }} />
      </RootStyle>
    )
  }
