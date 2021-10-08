import React from 'react'

import { WithClassname } from '../../../common/types'
import { cn } from '../../../common/utils/classes.util'
import styles from './Ghost.module.scss'
import { GhostText } from './GhostText.component'
import { GhostTitle } from './GhostTitle.component'

export const GhostListItem: React.FC<WithClassname> = ({ className = '' }) => {
  return (
    <li className={cn(className, 'flex')}>
      <span className={cn('h-10 w-10 rounded-full flex', styles.ghost)}></span>
      <div className="ml-2 w-full">
        <GhostTitle className="h-3 my-1 w-4/12" />
        <GhostText className="h-2.5 mb-1 mt-2 w-full" />
        <GhostText className="h-2.5 my-1 w-full" />
      </div>
    </li>
  )
}
