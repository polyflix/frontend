import { useContext } from 'react'

import { ISidebarContext, SidebarContext } from '@core/contexts/Sidebar.context'

export const useSidebar = (): ISidebarContext => {
  const context = useContext<ISidebarContext | undefined>(SidebarContext)
  if (!context) {
    throw new Error(
      'Missing provider. useSidebar can only be used inside SidebarProvider.'
    )
  }
  return context
}
