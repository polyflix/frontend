import React from 'react'

import { WithClassname } from '../../../../common/types'
import { cn } from '../../../../common/utils/classes.util'
import ghost_styles from '../Ghost.module.scss'
import styles from './GhostTile.module.scss'

type GhostTileParams = WithClassname & {
  aspectRatio: boolean
}

export const GhostTile: React.FC<GhostTileParams> = ({
  className = '',
  aspectRatio,
}) => {
  return (
    <div
      className={cn(className, aspectRatio && styles.root, ghost_styles.ghost)}
    ></div>
  )
}
