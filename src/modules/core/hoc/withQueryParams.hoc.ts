import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Look at given entries in parameters and give it in form of object
 * @param entries
 */
const extractQueryParams = <T>(entries: IterableIterator<[string, string]>) => {
  const expectedParams: { [key: string]: string } = {}
  for (const [paramKey, paramValue] of entries) {
    expectedParams[paramKey] = paramValue
  }

  return expectedParams as unknown as T
}

export const withQueryParams = <T>(OriginComponent: React.FC<T>) => {
  const WrapperComponent: typeof OriginComponent = () => {
    const urlSearch = new URLSearchParams(useLocation().search)
    const queryParams = extractQueryParams<T>(urlSearch.entries())

    // As query params might change over time, we want it to be stuck ot the initial value
    // That's why we create a state
    const [paramsValues] = useState<T>(queryParams)

    return React.createElement(OriginComponent, { ...paramsValues })
  }

  return WrapperComponent
}
