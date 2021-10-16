import { useSelector } from 'react-redux'

import { RootState } from '@core/store'

/**
 * A simple hook that returns the redux auth state
 * @returns
 */
export const useSnackBar = () => {
  return useSelector((state: RootState) => state.snackbar)
}
