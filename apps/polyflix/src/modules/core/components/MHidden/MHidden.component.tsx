import { useMediaQuery } from '@mui/material'
import { PropsWithChildren } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Type = 'Down' | 'Up'

interface Props {
  width: `${Breakpoint}${Type}`
}

// This component is used to hide children components when there is a match on the breakpoint.
export const MHidden = ({ children, width }: PropsWithChildren<Props>) => {
  const breakpoint = width.substring(0, 2)

  const hiddenUp = useMediaQuery((theme: any) =>
    theme.breakpoints.up(breakpoint)
  )
  const hiddenDown = useMediaQuery((theme: any) =>
    theme.breakpoints.down(breakpoint)
  )

  if (width.includes('Down')) {
    return <>{hiddenDown ? null : children}</>
  }

  if (width.includes('Up')) {
    return <>{hiddenUp ? null : children}</>
  }

  return <></>
}
