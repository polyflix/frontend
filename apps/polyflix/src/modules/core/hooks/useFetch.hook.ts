import { isUndefined } from 'lodash'
import { DependencyList, useEffect, useState } from 'react'

import { useInjection } from '@polyflix/di'
import { Injectable } from '@polyflix/di/dist/types'

import { useAuth } from '@auth/hooks/useAuth.hook'

type FetchReturn<T> = {
  isLoading: boolean
  data?: T
  error?: string
  refresh: (withLoading?: boolean) => void
}

type FetchOptions<T> = {
  onComplete?: (data: T) => any
  onStart?: () => any
  deps?: DependencyList
  /**
   * A condition to evaluate in order to run the fetch. Can be used to prevent some useless API calls.
   */
  if?: boolean
}

/**
 * A custom hook for data fetching in components.
 * @template Type the type of the data
 * @template Service the service class used for data-fetching
 * @param {Injectable} service the service containing the data fetching handler.
 * @param {string} handler the data fetching handler
 * @param {any[]} args the arguments to pass to the handler
 * @param {FetchOptions<Type>} options the options to pass to the hook.
 * @returns {FetchReturn<Type>}
 */
export const useFetch = <Type, Service>(
  service: Injectable,
  handler: keyof Service,
  args: any[] = [],
  options: FetchOptions<Type> = {}
): FetchReturn<Type> => {
  const { isLoading: isAuthLoading } = useAuth()

  const injectedService = useInjection<any>(service)

  const [data, setData] = useState<Type>()
  const [refresh, setRefresh] = useState<boolean>(false)
  const [withLoading, setWithLoading] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const fetch = async () => {
    try {
      if (withLoading) setLoading(true)

      const result = await injectedService[handler](...args)
      setData(result)
    } catch (err: any) {
      setError(err)
      setData(undefined)
    } finally {
      if (withLoading) setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthLoading) return
    // If the condition is undefined, we must run the fetch, however if it is defined, we want to evaluate the condition
    // and run the fetch only if it is true.
    if (isUndefined(options.if) ? true : options.if) fetch()
    // eslint-disable-next-line
  }, [...(options.deps || []), refresh])

  return {
    isLoading,
    data,
    error,
    refresh: (loading = true) => {
      setWithLoading(loading)
      setRefresh(!refresh)
    },
  }
}
