import { SnackbarProvider } from 'notistack'
import React, { PropsWithChildren } from 'react'

export const OverlayContainer: React.FC = ({
  children,
}: PropsWithChildren<{}>) => {
  return (
    <>
      <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
    </>
  )
}
