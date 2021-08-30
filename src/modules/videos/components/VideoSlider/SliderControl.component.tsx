import React, { PropsWithChildren } from 'react';
import { cn } from '../../../common/utils/classes.util';

type Props = { direction: 'next' | 'previous' }

const SliderControl: React.FC<PropsWithChildren<Props>> = ({
  children,
  direction,
}) => (
  <div
    style={{
      boxShadow: '0 0 80px 110px rgba(0, 0, 0, 0.5)',
    }}
    className={cn(
      `${direction === 'next' ? 'right' : 'left'}-0`,
      `control-${direction}`,
      'cursor-pointer absolute bg-black z-10 bg-opacity-50 top-0 h-full flex items-center px-2 transition-all text-nx-white hover:text-nx-red',
    )}
  >
    {children}
  </div>
);

export default SliderControl;
