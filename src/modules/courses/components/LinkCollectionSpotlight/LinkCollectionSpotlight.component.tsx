import { CircularProgress, Stack, Pagination } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'

import { Visibility } from '@core/models/content.model'

import { InlineCollectionCard } from '@collections/components/InlineCollectionCard/InlineCollectionCard.component'
import { Collection } from '@collections/models/collection.model'
import { useGetCollectionsQuery } from '@collections/services/collection.service'
import { CollectionFilters } from '@collections/types/filters.type'

type Props = {
  onSelectCollection: (collection: Collection) => void
}

export const LinkCollectionSpotlight: React.FC<Props> = ({
  onSelectCollection,
}) => {
  // const [query, setQuery] = useState('')
  // const [searchValue, setSearchValue] = useState('')

  const [filters, setFilters] = useState<CollectionFilters>({
    order: 'createdAt',
    page: 1,
    pageSize: 5,
    draft: false,
    visibility: Visibility.PUBLIC,
  })
  // We put a threshold, so when we type we don't search for EVERY characters
  // we wait a small time to know if the user ended typing or not
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => setQuery(searchValue), 500)
  //   return () => clearTimeout(timeoutId)
  // }, [searchValue])

  const { data: collections, isLoading } = useGetCollectionsQuery({
    ...filters,
  })
  // This way, we make the user understand the search is pending when
  // request is sent or when the state update is in timeout
  // const isLoading = isRequestPending || searchValue !== query
  let totalPage = Math.ceil((collections?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Box>
      <Stack>
        {isLoading && <CircularProgress sx={{ marginX: 'auto', marginY: 2 }} />}
      </Stack>
      {collections?.data?.map((collection) => (
        <div onClick={() => onSelectCollection(collection)} key={collection.id}>
          <InlineCollectionCard collection={collection} />
        </div>
      ))}
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={totalPage < 1 ? 1 : totalPage}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}
