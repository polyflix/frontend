import { PropsWithChildren } from 'react';
import { WithClassname, WithMotion } from '../../../../common/types/props.type';
import { cn } from '../../../../common/utils/classes.util';
import { Typography } from '../Typography.component';

type Props = WithClassname & WithMotion

export const Title: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = '',
  ...rest
}) => (
  <Typography
    {...rest}
    as="h1"
    className={cn(className, 'font-black text-2xl md:text-3xl')}
  >
    {children}
  </Typography>
);
