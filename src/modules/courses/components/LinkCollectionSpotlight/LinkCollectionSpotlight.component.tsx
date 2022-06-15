import {
  CircularProgress,
  Stack,
  Pagination,
  Typography,
  Paper,
} from '@mui/material'
import { Box } from '@mui/system'
import { alpha } from '@mui/system'
import React, { useState } from 'react'

import { Icon } from '@core/components/Icon/Icon.component'
import { Visibility } from '@core/models/content.model'
import { ease } from '@core/utils/transition'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { ElementContainerStyle } from '@collections/components/Forms/ElementModal/ElementModal.style'
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
  const { user } = useAuth()

  const [filters, setFilters] = useState<CollectionFilters>({
    order: '-createdAt',
    page: 1,
    pageSize: 5,
    draft: false,
    visibility: Visibility.PUBLIC,
  })

  const { data: collections, isLoading } = useGetCollectionsQuery({
    ...filters,
  })

  // This way, we make the user understand the search is pending when
  // request is sent or when the state update is in timeout
  // const isLoading = isRequestPending || searchValue !== query
  let totalPage = Math.ceil((collections?.total ?? 1) / (filters.pageSize ?? 1))

  const items = [
    {
      icon: 'si-glyph:global',
      label: 'All public modules',
      value: 'public',
    },
    {
      icon: 'ri:lock-password-line',
      label: 'My own modules (private and public)',
      value: 'own',
    },
  ]

  const [selectedModuleType, setSelectedModuleType] = useState<string>('public')
  const setDynamicFilters = (value: string) => {
    switch (value) {
      case 'public':
        setFilters({
          order: '-createdAt',
          page: 1,
          pageSize: 5,
          draft: false,
          visibility: Visibility.PUBLIC,
        })
        break
      case 'own':
        setFilters({
          order: '-createdAt',
          page: 1,
          pageSize: 5,
          draft: false,
          userId: user?.id,
        })
        break
    }
  }
  return (
    <Box>
      <Stack>
        {isLoading && <CircularProgress sx={{ marginX: 'auto', marginY: 2 }} />}
      </Stack>
      <ElementContainerStyle>
        {items.map(({ value: v, label, icon }, idx) => {
          const isActive = v === selectedModuleType
          return (
            <Box key={idx}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  cursor: 'pointer',
                  transition: (theme) => ease(theme, 'background'),
                  ...(isActive && {
                    background: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                  }),
                }}
                variant="outlined"
                onClick={() => {
                  setSelectedModuleType(v)
                  setDynamicFilters(v)
                }}
              >
                <Stack direction="row">
                  <Box sx={{ flexShrink: 1, mr: 2 }}>
                    <Icon name={icon} size={30} />
                  </Box>

                  <Stack>
                    <Typography variant="h5">{label}</Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          )
        })}
      </ElementContainerStyle>
      {collections?.data?.map((collection) => (
        <div onClick={() => onSelectCollection(collection)} key={collection.id}>
          <InlineCollectionCard collection={collection} />
        </div>
      ))}
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          page={filters.page}
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
