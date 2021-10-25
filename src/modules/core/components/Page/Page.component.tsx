import { Container } from '@mui/material'
import { Box } from '@mui/system'
import { forwardRef, PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'

interface Props {
  title?: string
  container?: boolean
  isLoading?: boolean
}

// eslint-disable-next-line react/display-name
export const Page = forwardRef<typeof Box, PropsWithChildren<Props>>(
  (
    {
      children,
      container = true,
      title = '',
      isLoading = false,
      ...other
    }: PropsWithChildren<Props>,
    ref
  ) => (
    <Box sx={{ height: '100%' }} ref={ref} {...other}>
      <Helmet>
        <title>{title === '' ? 'Polyflix' : `${title} | Polyflix`}</title>
      </Helmet>
      {isLoading ? (
        <LoadingLayout isPage={false} />
      ) : container ? (
        <Container>{children}</Container>
      ) : (
        children
      )}
    </Box>
  )
)
