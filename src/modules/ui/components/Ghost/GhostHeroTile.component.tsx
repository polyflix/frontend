import React from 'react';
import { cn } from '../../../common/utils/classes.util';
import { WithClassname } from '../../../common/types';
import styles from './Ghost.module.scss';

export const GhostHeroTile: React.FC<WithClassname> = ({ className = '' }) => (
  <div
    className={cn(className, styles.ghost, 'opacity-50')}
    style={{ minHeight: '200px', height: '80vh' }}
  />
);
