import { createContext, PropsWithChildren, useState } from 'react'

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
  const [open, setOpen] = useState<boolean>(false)

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
