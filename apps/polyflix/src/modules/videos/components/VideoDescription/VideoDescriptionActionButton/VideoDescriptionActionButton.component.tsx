import { Tooltip, Button, ButtonProps } from '@mui/material'
import { useState } from 'react'

type ActionButtonProps = {
  tooltip: string
} & ButtonProps

export const ActionButton = ({ tooltip, ...props }: ActionButtonProps) => {
  const [click, setClick] = useState(false)

  return (
    <Tooltip title={tooltip}>
      <Button
        onClick={() => setClick(!click)}
        variant={click ? 'outlined' : 'text'}
        size="small"
        {...props}
      >
        0
      </Button>
    </Tooltip>
  )
}
