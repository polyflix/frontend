import { motion } from 'framer-motion'
import { PropsWithChildren } from 'react'

import { WithClassname, WithMotion } from '../../../common/types/props.type'
import { cn } from '../../../common/utils/classes.util'

export type ButtonProps = WithClassname &
  WithMotion & {
    as: 'button' | 'input'
    inputValue?: string
    disabled?: boolean
    form?: string
    onClick?: (
      e: React.MouseEvent<HTMLButtonElement | HTMLInputElement, MouseEvent>
    ) => void
    title?: string
  }

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  as,
  children,
  inputValue = '',
  className = '',
  disabled = false,
  form = '',
  ...rest
}) => {
  const As = motion[as]
  const classes = cn(
    className,
    'cursor-pointer py-3 px-4 rounded-md font-bold focus:outline-none'
  )
  if (as === 'input') {
    return (
      <As
        {...rest}
        disabled={disabled}
        className={classes}
        type="submit"
        value={inputValue}
        {...(form && { form })}
      ></As>
    )
  } else {
    return (
      <As {...rest} disabled={disabled} className={classes}>
        {children}
      </As>
    )
  }
}
