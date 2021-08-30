import React from 'react';
import { cn } from '../../../common/utils/classes.util';
import { WithClassname } from '../../../common/types';
import { GhostTile } from './GhostTile/GhostTile.component';
import { GhostText } from './GhostText.component';

/**
 * See StatTile for more info about its rendering
 * @param className
 */
export const GhostStatTile: React.FC<WithClassname> = ({ className = '' }) => (
  <div
    className={cn(
      'col-span-12 lg:col-span-4 xl:col-span-4 text-center flex flex-col justify-center',
      className,
    )}
  >
    <GhostTile aspectRatio={false} className="h-4 w-6/12 mx-auto my-2" />
    <GhostText className="w-3/12 h-12 mx-auto" />
  </div>
);
