import { Box, Container, ContainerProps, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { forwardRef, PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'

import {
  APP_BAR_DESKTOP,
  APP_BAR_MOBILE,
} from '@core/layouts/Dashboard/Dashboard.style'
import { ErrorLayout } from '@core/layouts/Error/Error.layout'
import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'

type PageProps = {
  title?: string
  error?: FetchBaseQueryError | SerializedError
  isLoading?: boolean
  sx?: SxProps<Theme>
} & ContainerProps

// eslint-disable-next-line react/display-name
export const Page = forwardRef<typeof Box, PropsWithChildren<PageProps>>(
  (
    {
      children,
      title = '',
      error,
      isLoading = false,
      sx,
      ...containerProps
    }: PropsWithChildren<PageProps>,
    ref
  ) => (
    <Box
      sx={{
        height: '100%',
        width: '100%',
      }}
      ref={ref}
    >
      <Helmet>
        <title>{title === '' ? 'Polyflix' : `${title} | Polyflix`}</title>
      </Helmet>
      {isLoading ? (
        <Box
          sx={{
            pt: {
              xs: `${APP_BAR_MOBILE + 24}px`,
              lg: `${APP_BAR_DESKTOP + 24}px`,
            },
            ...sx,
          }}
        >
          <LoadingLayout isPage={false} />
        </Box>
      ) : (
        <Container
          sx={{
            pt: {
              xs: `${APP_BAR_MOBILE + 24}px`,
              lg: `${APP_BAR_DESKTOP + 24}px`,
            },
            ...sx,
          }}
          {...containerProps}
        >
          {error ? (
            <ErrorLayout code={(error as FetchBaseQueryError).status} />
          ) : (
            children
          )}
        </Container>
      )}
    </Box>
  )
)
