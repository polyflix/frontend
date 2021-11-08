import SearchIcon from '@mui/icons-material/Search'
import { CircularProgress, Stack } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Search,
  SearchFieldInModal,
  SearchIconWrapper,
} from '@core/components/Spotlight/Spotlight.style'
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
  const { t } = useTranslation('courses')
  const [query, setQuery] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const fetchFilters = useMemo<CollectionFilters>(
    () => ({
      join: [{ field: 'user', select: ['avatar'] }],
      sort: [{ field: 'createdAt', order: 'DESC' }],
      limit: 5,
      draft: false,
      visibility: Visibility.PUBLIC,
      search: {
        name: {
          $contL: query,
        },
      },
    }),
    [query]
  )
  // We put a threshold, so when we type we don't search for EVERY characters
  // we wait a small time to know if the user ended typing or not
  useEffect(() => {
    const timeoutId = setTimeout(() => setQuery(searchValue), 500)
    return () => clearTimeout(timeoutId)
  }, [searchValue])

  const { data: collections, isLoading: isRequestPending } =
    useGetCollectionsQuery(fetchFilters)
  // This way, we make the user understand the search is pending when
  // request is sent or when the state update is in timeout
  const isLoading = isRequestPending || searchValue !== query

  return (
    <Box>
      <Search>
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
      </Search>
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
