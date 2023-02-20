import { PropsWithChildren } from 'react'

import { DashboardNavbar } from '@core/components/Dashboard/Navbar/Navbar.component'
import { SidebarProvider } from '@core/contexts/Sidebar.context'

import { MainStyle, RootStyle } from './Dashboard.style'

export const DashboardLayout: React.FC = ({
  children,
}: PropsWithChildren<{}>) => {
  return (
    <SidebarProvider>
      <RootStyle>
        <DashboardNavbar />
        <MainStyle>{children}</MainStyle>
      </RootStyle>
    </SidebarProvider>
  )
}
