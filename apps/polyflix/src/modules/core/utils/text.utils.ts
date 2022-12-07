export const clampString = (value: string, maxLength: number): string =>
  `${value.slice(0, maxLength)}${value.length > maxLength ? '...' : ''}`
