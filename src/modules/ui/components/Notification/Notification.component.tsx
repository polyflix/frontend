import { AnimatePresence, motion } from "framer-motion";
import { Key, PropsWithChildren } from "react";

type Props = {
  /** The key of the component */
  key?: Key;
  /** If true, the notification will appear, otherwise not. */
  show?: boolean;
  /** Define the timeout for the notification in milliseconds */
  timeout?: number;
  /** Callback called when timeout is reached */
  onTimeout?: () => void;
};

const notificationAnimation = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 120, opacity: 0 },
};

/**
 * Simple component to display a notification.
 */
export const Notification: React.FC<PropsWithChildren<Props>> = ({
  show,
  key,
  timeout,
  onTimeout,
  children,
}) => {
  if (timeout && onTimeout) {
    setTimeout(() => onTimeout(), timeout);
  }
  return (
    <AnimatePresence exitBeforeEnter>
      {show && (
        <motion.div
          key={key}
          variants={notificationAnimation}
          className="fixed left-0 flex justify-center bottom-4 w-full"
        >
          <div className="bg-nx-dark w-11/12 md:w-8/12 lg:w-6/12 rounded-md p-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
