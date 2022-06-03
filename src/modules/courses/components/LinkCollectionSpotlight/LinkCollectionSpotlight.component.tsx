import { CircularProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { useMemo } from 'react'

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
  const fetchFilters = useMemo<CollectionFilters>(
    () => ({
      order: 'createdAt',
      pageSize: 5,
      draft: false,
      visibility: Visibility.PUBLIC,
    }),
    []
  )
  // We put a threshold, so when we type we don't search for EVERY characters
  // we wait a small time to know if the user ended typing or not
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => setQuery(searchValue), 500)
  //   return () => clearTimeout(timeoutId)
  // }, [searchValue])

  const { data: collections, isLoading } = useGetCollectionsQuery(fetchFilters)
  // This way, we make the user understand the search is pending when
  // request is sent or when the state update is in timeout
  // const isLoading = isRequestPending || searchValue !== query

  return (
    <Box>
      {/* <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <SearchFieldInModal
          autoFocus
          placeholder={t('form.upsert.search')}
          InputProps={{
            'aria-label': 'search',
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2">esc</Typography>
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          variant="filled"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Search> */}
      <Stack>
        {isLoading && <CircularProgress sx={{ marginX: 'auto', marginY: 2 }} />}
      </Stack>
      {collections?.data?.map((collection) => (
        <div onClick={() => onSelectCollection(collection)} key={collection.id}>
          <InlineCollectionCard collection={collection} />
        </div>
      ))}
    </Box>
  )
}
