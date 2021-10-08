import React from 'react'

import { WithClassname } from '../../../common/types'
import { cn } from '../../../common/utils/classes.util'
import { GhostListItem } from './GhostListItem.component'

type Props = WithClassname & {
  count: number
}

export const GhostList: React.FC<Props> = ({ count, className = '' }) => {
  const ghosts = () => {
    return new Array(count).fill(null)
  }

  return (
    <ul className={cn(className, 'w-full gap-2 flex flex-col')}>
      {ghosts().map((_, i: number) => (
        <GhostListItem key={i} />
      ))}
    </ul>
  )
}
