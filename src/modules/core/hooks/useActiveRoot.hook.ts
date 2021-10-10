import { matchPath, useLocation } from 'react-router-dom'

export const useActiveRoot = (path: string): boolean => {
  const { pathname } = useLocation()
  return path
    ? !!matchPath(path, {
        path: pathname,
        exact: true,
        strict: false,
      })
    : false
}
