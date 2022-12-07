import { Icon as IconIconify } from '@iconify/react'
import React, { PropsWithChildren } from 'react'

type IconProps = {
  name: string
  size?: number
}

export const Icon: React.FC<PropsWithChildren<IconProps>> = ({
  name,
  size = 24,
}) => {
  return <IconIconify icon={name} width={size} height={size} />
}
