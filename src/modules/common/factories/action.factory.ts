import { GenericAction } from '../types/generic.type'

/**
 * Factory used to create generic action.
 * @param {string} type the action type
 * @param {T | Partial<T>} payload the payload of the action
 * @returns {GenericAction<T>} the action
 */
export const actionFactory = <T>(
  type: string,
  payload?: T | Partial<T>
): GenericAction<T> => {
  return {
    type,
    payload,
  }
}
