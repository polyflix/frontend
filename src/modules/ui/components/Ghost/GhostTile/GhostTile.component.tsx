import React from 'react';
import { cn } from '../../../../common/utils/classes.util';
import { WithClassname } from '../../../../common/types';
import styles from './GhostTile.module.scss';
import ghost_styles from '../Ghost.module.scss';

type GhostTileParams = WithClassname & {
  aspectRatio: boolean
}

export const GhostTile: React.FC<GhostTileParams> = ({
  className = '',
  aspectRatio,
}) => (
  <div
    className={cn(className, aspectRatio && styles.root, ghost_styles.ghost)}
  />
);
