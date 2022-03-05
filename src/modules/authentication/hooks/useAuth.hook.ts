import { useSelector } from 'react-redux'

import { RootState } from '@core/store'
import { useKeycloak } from '@react-keycloak/web'

/**
 * A simple hook that returns the redux auth state
 * @returns
 */
export const useAuth = () => {
  const selector = useSelector((state: RootState) => state.auth)
  return selector
}
