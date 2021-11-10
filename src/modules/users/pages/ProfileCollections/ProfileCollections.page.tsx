import {
  Box,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionCard } from '@collections/components/CollectionCard/CollectionCard.component'
import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'
import { buildCollectionSearch } from '@collections/helpers/search.helper'
import { Collection } from '@collections/models/collection.model'
import { useGetCollectionsQuery } from '@collections/services/collection.service'
import { CollectionFilters } from '@collections/types/filters.type'

export const ProfileCollectionsPage = () => {
  const { t } = useTranslation('users')
  const { user } = useAuth()
  const [filters, setFilters] = useState<CollectionFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    join: [{ field: 'elements', select: ['type'] }, { field: 'user' }],
    'user.id': user!.id,
    page: 1,
    limit: 10,
  })

  const {
    data: collections,
    isLoading,
    isFetching,
  } = useGetCollectionsQuery({
    join: [{ field: 'elements', select: ['type'] }, { field: 'user' }],
    'user.id': user!.id,
    ...filters,
  })

  const skeletons = buildSkeletons(3)

  return (
    <Page
      isLoading={isLoading}
      title={t('profile.tabs.collections.content.title')}
      sx={{ mt: 3 }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('profile.tabs.collections.content.title')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: {
                $and: [
                  ...buildCollectionSearch(search),
                  {
                    'user.id': {
                      $eq: user!.id,
                    },
                  },
                ],
              },
            })
          }}
          label={t('navbar.actions.search.fast', { ns: 'common' })}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>

      <Grid sx={{ my: 3 }} container columnSpacing={2} rowSpacing={4}>
        {collections?.data && collections.data.length === 0 && (
          <NoData variant="collections" link="/collections/create" />
        )}
        {!isFetching
          ? collections?.data.map((item: Collection) => (
              <Grid key={item.id} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCard collection={item} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={collections?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Page>
  )
}
