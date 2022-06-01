import { Typography } from '@mui/material'
import { PropsWithChildren } from 'react'

import { Page } from '@core/components/Page/Page.component'

interface AdminLayoutProps {
  pageTitle: string
}

export const AdminLayout = ({
  children,
  pageTitle,
}: PropsWithChildren<AdminLayoutProps>) => {
  return (
    <Page title={pageTitle} maxWidth={false}>
      <Typography sx={{ marginBottom: '20px' }} variant="h3">
        {pageTitle}
      </Typography>
      {children}
    </Page>
  )
}
