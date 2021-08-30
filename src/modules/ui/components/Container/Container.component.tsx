import React, { PropsWithChildren } from 'react';
import { WithClassname } from '../../../common/types/props.type';
import { cn } from '../../../common/utils/classes.util';

type Props = WithClassname & {
  /** If set to true, the content will be centered. Default to false */
  mxAuto?: boolean
  /** If set to true, the container will take full width */
  fluid?: boolean
}

/**
 * Component which create a container.
 */
export const Container: React.FC<PropsWithChildren<Props>> = ({
  children,
  mxAuto = false,
  className = '',
  fluid,
}) => (
  <div
    className={cn(fluid ? '' : 'container', mxAuto && 'mx-auto', className)}
  >
    {children}
  </div>
);
