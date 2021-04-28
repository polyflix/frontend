/**
 * Concatenate multiple classes to a single string.
 * Can accept conditional classes like `true && "class-if-true"`.
 * @param {(string|boolean)[]} classes the classes to join
 * @returns {string} the joined classes
 */
export const cn = (...classes: Array<string | boolean>): string =>
  classes.filter(Boolean).join(" ");

/**
 * Return style for background image.
 * @param {string} url the url of the image to put in background.
 */
export const applyBackgroundImage = (url: string) => ({
  backgroundImage: `url(${url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});
