import { PropsWithChildren } from 'react'

import { WithClassname, WithMotion } from '../../../../common/types/props.type'
import { cn } from '../../../../common/utils/classes.util'
import { Typography } from '../Typography.component'

type Props = WithClassname & WithMotion & { overrideDefaultClasses?: boolean }

export const Paragraph: React.FC<PropsWithChildren<Props>> = ({
  overrideDefaultClasses = false,
  children,
  className = '',
  ...rest
}) => {
  return (
    <Typography
      {...rest}
      overrideDefaultClasses={overrideDefaultClasses}
      className={cn(
        className,
        !overrideDefaultClasses && 'font-light leading-6 md:text-base'
      )}
      as="p"
    >
      {children}
    </Typography>
  )
}
