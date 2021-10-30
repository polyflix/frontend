import { Box, Container, ContainerProps, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { forwardRef, PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'

import { SyncBreadcrumb } from '../SyncBreadcrumb/SyncBreadcrumb.component'

type PageProps = {
  title?: string
  isLoading?: boolean
  sx?: SxProps<Theme>
} & ContainerProps

// eslint-disable-next-line react/display-name
export const Page = forwardRef<typeof Box, PropsWithChildren<PageProps>>(
  (
    {
      children,
      title = '',
      isLoading = false,
      sx,
      ...containerProps
    }: PropsWithChildren<PageProps>,
    ref
  ) => (
    <Box sx={{ height: '100%', width: '100%' }} ref={ref}>
      <Helmet>
        <title>{title === '' ? 'Polyflix' : `${title} | Polyflix`}</title>
      </Helmet>
      {isLoading ? (
        <LoadingLayout isPage={false} />
      ) : (
        <Container sx={{ ...sx }} {...containerProps}>
          <SyncBreadcrumb />
          {children}
        </Container>
      )}
    </Box>
  )
)
