import { Skeleton, Stack, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'

import { Page } from '@core/components/Page/Page.component'

interface AdminLayoutProps {
  pageTitle: string | undefined
  action?: React.ReactNode
}

export const AdminLayout = ({
  children,
  pageTitle,
  action,
}: PropsWithChildren<AdminLayoutProps>) => {
  return (
    <Page title={pageTitle} maxWidth={false}>
      {pageTitle ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: '20px' }}
        >
          <Typography variant="h3">{pageTitle}</Typography>
          {action && action}
        </Stack>
      ) : (
        <Skeleton animation="wave" width="150px" height={25} />
      )}

      {children}
    </Page>
  )
}
