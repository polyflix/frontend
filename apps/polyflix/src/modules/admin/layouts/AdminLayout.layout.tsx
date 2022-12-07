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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {pageTitle ? (
          <>
            <Typography variant="h3">{pageTitle}</Typography>
            {action && action}
          </>
        ) : (
          <Skeleton animation="wave" width="150px" height={25} />
        )}
      </Stack>

      {children}
    </Page>
  )
}
