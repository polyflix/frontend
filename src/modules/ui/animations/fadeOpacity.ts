const easing = [0.6, -0.05, 0.01, 0.99];

export const fadeOpacity = {
  initial: {
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easing,
    },
  },
};
