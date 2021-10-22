import { range } from 'lodash'
import { shallowEqual, useSelector } from 'react-redux'

import { isAGenericResourceState } from '@core/helpers/interface.helper'
import { BaseModel } from '@core/models/base.model'
import { RootState } from '@core/store'
import { GenericResourceState } from '@core/types/state.type'

const badTypeError = new TypeError(
  `The hook useResourceState should be used with a GenericResourceState.`
)

/**
 * @param rootState
 * @param state
 * @returns
 */
export const getSlice = <T extends BaseModel>(
  rootState: RootState,
  state: keyof RootState
): GenericResourceState<T> => {
  const slice: unknown = rootState[state]
  if (!isAGenericResourceState(slice)) {
    throw badTypeError
  }
  return slice as GenericResourceState<T>
}

/**
 * Get an optimized data object of your state. By using this hook, you can get the data from your GenericResourceState,
 * but the return value is optimized in order to avoid multiple re-renders.
 *
 * The returned object contains 2 fields :
 * - an array of object id, for example, if your state store Video, the array contains all your videos ids.
 * - a boolean which indicates that your state is loading or not.
 *
 * By using array of id perhaps array of object directly, we can ensure that only the updated objects will trigger re-renders when the state will
 * be updated in the future. See the link below for more informations.
 * @see https://redux.js.org/tutorials/fundamentals/part-5-ui-react#selecting-data-in-list-items-by-id
 *
 * @template T the type of the model stored in the state. Should extends BaseModel.
 * @param state the state you want to get
 * @returns An object containing an array of items id, and a boolean to check if there is currently a loading or not.
 */
export const useResourceState = <T extends BaseModel>(
  state: keyof RootState
) => {
  const isLoading = useSelector(
    (rootState: RootState) => getSlice<T>(rootState, state).isLoading,
    shallowEqual
  )

  // Get the data id from the state.
  // We get only id to improve re-renders and app performance.
  // For more info, see : https://redux.js.org/tutorials/fundamentals/part-5-ui-react#selecting-data-in-list-items-by-id
  const data = useSelector(
    (rootState: RootState) =>
      getSlice<T>(rootState, state).data.map(({ id }) => id),
    shallowEqual
  )

  return { data: isLoading ? range(20).map(toString) : data, isLoading }
}
