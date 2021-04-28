const stagger = (v: number) => {
  return {
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
  };
};

export default stagger;
