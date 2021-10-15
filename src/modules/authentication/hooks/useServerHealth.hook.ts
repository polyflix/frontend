import { useSelector } from 'react-redux'

import { ServerHealth } from '@core/reducers/server.reducer'
import { RootState } from '@core/store'

/**
 * A simple hook that returns an object containing two fields, isHealthy and isUnealthy that allows us to
 * implement some behaviors when the server status change.
 * @returns
 */
export const useServerHealth = () => {
  const status = useSelector((state: RootState) => state.server.status)
  return {
    isHealthy: status === ServerHealth.HEALTHY,
    isUnhealthy: status === ServerHealth.UNHEALTHY,
  }
}
