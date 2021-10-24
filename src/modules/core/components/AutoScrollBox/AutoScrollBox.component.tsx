import { Box } from '@mui/material'
import React, { PropsWithChildren } from 'react'

import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'

export const AutoScrollBox: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 0 auto',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flex: '1 0 0',
              flexBasis: 0,
              minHeight: 0,
              flexFlow: 'column nowrap',
            }}
          >
            <Scrollbar
              sx={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                flex: '1 1 auto',
              }}
            >
              {children}
            </Scrollbar>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
