import { useLocation } from 'react-router-dom'

export const useQuery = (key?: string): URLSearchParams | string | null => {
  const params = new URLSearchParams(useLocation().search)
  return key ? params.get(key) : params
}
