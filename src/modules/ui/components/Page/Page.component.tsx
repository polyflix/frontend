import { motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet';
import {
  Navigation,
  NAV_HEIGHT,
} from '../../../common/components/Navigation/Navigation.component';
import {
  WithClassname,
  WithMotion,
  WithSEO,
} from '../../../common/types/props.type';
import { cn } from '../../../common/utils/classes.util';
import { Spinner } from '../Spinner/Spinner.component';

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
  description = '',
  isLoading = false,
  ...rest
}) => {
  window.scrollTo(0, 0);
  return (
    <motion.div
      animate="animate"
      initial="initial"
      exit="exit"
      className={cn(className, 'dark:bg-black min-h-screen')}
    >
      <Helmet>
        <title>
          {title && !isLoading ? `${title} | Polyflix` : 'Polyflix'}
        </title>
      </Helmet>
      <Navigation visible={withNavbar} />
      <motion.div
        {...rest}
        style={isLoading || withPadding ? { paddingTop: NAV_HEIGHT } : {}}
        className="w-full h-full"
      >
        {isLoading ? (
          <Spinner page style={{ height: `calc(100vh - ${NAV_HEIGHT}px)` }} />
        ) : (
          children
        )}
      </motion.div>
    </motion.div>
  );
};
