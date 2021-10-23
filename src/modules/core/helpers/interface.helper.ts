import { has } from 'lodash'

/**
 * A simple function that returns true if the object in parameters is a GenericResourceState, false otherwise.
 * @param object the object to test
 * @returns true if is a GenericResourceState, false otherwise
 */
export const isAGenericResourceState = (object: any): boolean => {
  return has(object, 'data') && has(object, 'isLoading')
}
