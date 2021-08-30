import { useInjection } from '@polyflix/di'
import { useEffect, useState } from 'react'
import { useAuth } from '../../authentication/hooks/useAuth.hook'
import { AlertType } from '../../ui/components/Alert/Alert.component'
import { Collection } from '../models'
import { CollectionService } from '../services'
import {
  CollectionState,
  CollectionsWithPagination,
  CollectionParams,
} from '../types'

type UseCollectionHookOptions = CollectionParams & {
  /**
   * The fetch mode for the hook.
   * If set to "document", the hook will adapt the query to fetch only one document.
   * Otherwise, the hook will adapt the query to fetch paginated collection of documents.
   */
  mode: 'document' | 'collection'
}

/**
 * Custom hook for use collections fetching in components.
 * @param {UseCollectionHookOptions} options the configuration of the hook behavior.
 * @returns {CollectionState<T>} the collection state
 */
export const useCollections = <T = Collection | CollectionsWithPagination>(
  options: UseCollectionHookOptions
): CollectionState<T> => {
  const collectionService = useInjection<CollectionService>(CollectionService)
  const { isLoading: authLoading } = useAuth()
  // Configuration destructuration
  const { page, pageSize, mode, slug } = options || {}

  // States definitions
  const [reload, setReload] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<T | null>(null)
  const [alert, setAlert] =
    useState<{
      type: AlertType
      message: string
    } | null>(null)

  // Is the hook in collection mode
  const isCollection = mode === 'collection'

  const refresh = () => setReload(!reload)

  useEffect(() => {
    // If the auth is currently loading, skip the call
    // because we potentially want a token to execute the
    // query.
    if (authLoading) return
    setLoading(true)
    ;(isCollection
      ? collectionService.getCollections(options)
      : collectionService.getCollectionBySlug(slug as string)
    )
      .then((data: any) => {
        // if (isCollection && onCollectionLoaded) {
        //   onCollectionLoaded(+(data as VideosWithPagination).totalCount);
        // }
        setData(data)
      })
      .catch((err: any) => {
        setAlert({ type: 'error', message: err })
        setData(null)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line
  }, [page, pageSize, reload])

  return { data, alert, isLoading: loading, refresh }
}
