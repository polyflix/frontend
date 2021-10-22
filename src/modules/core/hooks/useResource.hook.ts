import { useSelector } from 'react-redux'

import { BaseModel } from '@core/models/base.model'
import { RootState } from '@core/store'

import { getSlice } from './useResourceState.hook'

/**
 * Get a resource from a GenericResourceState by it's identifier.
 * @param resourceId the identifier of the resource
 * @param state the state where the resource is located
 * @returns the resource or undefined if not found
 */
export const useResource = <T extends BaseModel>(
  resourceId: string,
  state: keyof RootState
) => {
  return useSelector((rootState: RootState) =>
    getSlice<T>(rootState, state).data.find(({ id }) => id === resourceId)
  )
}
