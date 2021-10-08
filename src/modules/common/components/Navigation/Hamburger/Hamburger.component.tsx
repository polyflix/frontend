import React, { useState } from 'react'

import { WithClassname } from '../../../types'
import { cn } from '../../../utils'
import styles from './hamburger.module.scss'

type Props = WithClassname & {
  /** Callback function called when the user click on the hamburger menu. */
  onToggle: (active: boolean) => any
}

const Hamburger: React.FC<Props> = ({ onToggle, className = '' }) => {
  const [active, setActive] = useState(false)
  const defaultClasses = active
    ? `${styles.toggler} ${styles.change}`
    : `${styles.toggler}`
  return (
    <div
      onClick={() => {
        onToggle(!active)
        setActive(!active)
      }}
      id="menu-icon"
      className={cn(defaultClasses, className, 'md:hidden')}
    >
      <div className={cn(styles.bar1, 'bg-nx-white')}></div>
      <div className={cn(styles.bar2, 'bg-nx-white')}></div>
      <div className={cn(styles.bar3, 'bg-nx-white')}></div>
    </div>
  )
}

export default Hamburger
