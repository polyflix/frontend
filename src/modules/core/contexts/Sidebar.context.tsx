import { useMediaQuery, useTheme } from '@mui/material'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'

// The definition of the sidebar context
export interface ISidebarContext {
  open: boolean
  toggle: (isOpen?: boolean) => void
}

// The context of the sidebar
export const SidebarContext = createContext<ISidebarContext | undefined>(
  undefined
)

// The SidebarProvider allows every children to access the context. It allows them to use the
// useSidebar hook in the components hierarchy to access the Sidebar state.
export const SidebarProvider = ({ children }: PropsWithChildren<{}>) => {
  const theme = useTheme()
  const ltsm: boolean = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState<boolean>(!ltsm)

  useEffect(() => (ltsm ? setOpen(false) : setOpen(true)), [ltsm])

  return (
    <SidebarContext.Provider
      value={{
        open,
        toggle: () => setOpen(!open),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
