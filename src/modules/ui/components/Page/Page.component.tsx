import { motion } from 'framer-motion'
import { isUndefined } from 'lodash'
import React, { PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet'

import { Footer } from '../../../common/components/Footer/Footer.component'
import {
  Navigation,
  NAV_HEIGHT,
} from '../../../common/components/Navigation/Navigation.component'
import { ForbiddenPage } from '../../../common/pages/403.page'
import {
  WithClassname,
  WithMotion,
  WithSEO,
} from '../../../common/types/props.type'
import { cn } from '../../../common/utils/classes.util'
import { Spinner } from '../Spinner/Spinner.component'
import styles from './Page.module.scss'

type Props = WithMotion &
  WithClassname &
  WithSEO & {
    /** If set to true, the navbar will not hide content */
    withPadding?: boolean
    /** If set to true, the page will display a spinner */
    isLoading?: boolean
    /** If set to false, the navbar will be invisible */
    withNavbar?: boolean
    /** If true, the navbar will be animated on exit */
    animateNavbarExit?: boolean
    guard?: boolean
  }

/**
 * A wrapper component to use in your page component.
 */
export const Page: React.FC<PropsWithChildren<Props>> = ({
  children,
  withPadding = true,
  withNavbar = true,
  className = '',
  title,
  isLoading = false,
  guard,
  ...rest
}) => {
  window.scrollTo(0, 0)
  return (
    <motion.div
      animate="animate"
      initial="initial"
      exit="exit"
      className={cn(className, styles.container, 'dark:bg-black min-h-screen')}
    >
      <Helmet>
        <title>
          {title && !isLoading ? `${title} | Polyflix` : 'Polyflix'}
        </title>
      </Helmet>
      <Navigation visible={withNavbar} className={styles.header} />
      <motion.div
        {...rest}
        style={isLoading || withPadding ? { paddingTop: NAV_HEIGHT } : {}}
        className={cn(styles.main, 'w-full')}
      >
        {isLoading ? (
          <Spinner page style={{ height: `calc(100vh - ${NAV_HEIGHT}px)` }} />
        ) : !isUndefined(guard) && !guard ? (
          <ForbiddenPage />
        ) : (
          children
        )}
      </motion.div>
      <Footer className={styles.footer} />
    </motion.div>
  )
}
