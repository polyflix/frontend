import { PropsWithChildren } from 'react'
import { StudioSidebar } from '@core/components/Dashboard/Sidebar/Sidebar.component'
import { SidebarProvider } from '@core/contexts/Sidebar.context'

import { MainStyle, RootStyle } from './StudioLayout.style'
import { StudioNavbar } from '@core/components/Dashboard/StudioNavbar/Navbar.component'

export const StudioLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <SidebarProvider>
      <RootStyle>
        <StudioNavbar />
        <StudioSidebar />
        <MainStyle>{children}</MainStyle>
      </RootStyle>
    </SidebarProvider>
  )
}
