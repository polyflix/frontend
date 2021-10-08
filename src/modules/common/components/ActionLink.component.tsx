import React from 'react'
import { Link } from 'react-router-dom'

import { Typography } from '../../ui'
import { cn } from '../utils'

type Props = {
  Icon: any
  text: string
  to?: string
  className?: string
  onClick?: () => void
}

/**
 * Generic link where there is an icon on left & a text on its right
 * The icon is red & text is white
 *
 * Be aware that having a `to` property will not work along `onClick`
 * @param Icon -- Icon from heroIcons
 * @param text -- Text (translation most of the time)
 * @param to -- The redirect link
 * @param className -- Override classname on the whole block
 * @param onClick -- Triggered action on click
 */
export const ActionLink: React.FC<Props> = ({
  Icon,
  text,
  to,
  className = '',
  onClick,
}) => {
  const content = (
    <Typography
      as="span"
      className={cn(
        'flex text-sm md:text-base hover:underline cursor-pointer hover:text-nx-red',
        className
      )}
    >
      <Icon className="w-4 md:w-5 mr-2 text-nx-red" /> {text}
    </Typography>
  )
  return to ? (
    <Link to={to}>{content}</Link>
  ) : (
    <span onClick={onClick}>{content}</span>
  )
}
