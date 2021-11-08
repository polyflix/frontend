/**
 * Returns the protocol + the domain name of an url
 * @param url The full url to extract domain name
 * @example
 * // returns "https://youtube.com"
 * getDomain("https://www.youtube.com/watch?v=sJ-c3BA-Ypo")
 */
export const getDomain = (url: string): string => {
  const match = url.match(
    /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/
  )
  if (match && match?.length > 0) {
    return match[1]
  } else return ''
}
