import { useLocation } from 'react-router-dom'

export const useSearchQuery = (key: string) => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  return query.get(key)
}
