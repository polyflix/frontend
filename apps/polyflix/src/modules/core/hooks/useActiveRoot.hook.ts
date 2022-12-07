import { matchPath, useLocation } from 'react-router-dom'

export const useActiveRoot = (path?: string): boolean => {
  const { pathname } = useLocation()

  if (!path) return false

  return !!matchPath(path, {
    path: pathname,
    exact: true,
    strict: false,
  })
}
