import { useSelector } from 'react-redux'

import { RootState } from '@core/redux/store'

/**
 * A simple hook that returns the redux auth state
 * @returns
 */
export const useAuth = () => {
  return useSelector((state: RootState) => state.auth)
}
