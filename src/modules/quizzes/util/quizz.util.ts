export const getColor = (scorePercentage: number) => {
  if (scorePercentage === 0) return "#949495";
  if (scorePercentage >= 75) {
    return "#48bb78";
  } else if (scorePercentage >= 25 && scorePercentage < 75) {
    return "#d69e2e";
  }
  return "#c53030";
};

export const asPercentage = (score: number, max: number): number =>
  (score * 100) / max;
