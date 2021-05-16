export const stagger = (v: number) => ({
  animate: {
    transition: {
      staggerChildren: v,
    },
  },
  exit: {
    transition: {
      staggerChildren: v - 0.03,
    },
  },
});
