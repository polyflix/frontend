import { Theme } from '@mui/material'
import { Popover } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { PropsWithChildren } from 'react'

import { ArrowStyle } from './MenuPopOver.style'

type MenuPopoverProps = {
  sx?: SxProps<Theme>
  open: boolean
  onClose: () => any
  anchorEl: HTMLElement | (() => any) | null
}

export const MenuPopover: React.FC<PropsWithChildren<MenuPopoverProps>> = ({
  children,
  sx,
  open,
  onClose,
  anchorEl,
}) => {
  return (
    <Popover
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          mt: 1.5,
          ml: 0.5,
          overflow: 'inherit',
          boxShadow: (theme) => theme.shadows[20],
          border: (theme) => `solid 1px ${theme.palette.background.paper}`,
          background: (theme) => theme.palette.background.paper,
          width: 200,
          ...sx,
        },
      }}
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
    >
      <ArrowStyle className="arrow" />

      {children}
    </Popover>
  )
}
