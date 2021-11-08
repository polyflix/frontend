export const clampString = (value: string, maxLength: number): string =>
  `${value.slice(0, maxLength)}${value.length > maxLength ? '...' : ''}`
export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
