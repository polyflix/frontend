import React from 'react'

import { WithClassname } from '../../../common/types'
import { cn } from '../../../common/utils/classes.util'
import styles from './Ghost.module.scss'

export const GhostHeroTile: React.FC<WithClassname> = ({ className = '' }) => {
  return (
    <div
      className={cn(className, styles.ghost, 'opacity-50')}
      style={{ minHeight: '200px', height: '80vh' }}
    ></div>
  )
}
