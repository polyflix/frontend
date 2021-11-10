import { Box, Divider, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { Visibility } from '@core/models/content.model'
import { buildSkeletons } from '@core/utils/gui.utils'

import { buildCollectionSearch } from '@collections/helpers/search.helper'
import { Collection } from '@collections/models/collection.model'
import { useGetCollectionsQuery } from '@collections/services/collection.service'
import { CollectionFilters } from '@collections/types/filters.type'

import { CollectionCard } from '../../components/CollectionCard/CollectionCard.component'
import { CollectionCardSkeleton } from '../../components/CollectionCardSkeleton/CollectionCardSkeleton.component'

export const ExploreCollectionPage = () => {
  const { t } = useTranslation('collections')
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<CollectionFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: parseInt(params.get('page') || '1'),
    limit: 10,
  })

  const { data, isLoading, isFetching } = useGetCollectionsQuery({
    join: [{ field: 'elements', select: ['type'] }],
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

  const collections: Collection[] = data?.data || []

  const skeletons = buildSkeletons(3)

  return (
    <Page isLoading={isLoading} title={t('explore.title')}>
      <Header
        title={t('explore.title')}
        description={t('explore.description')}
      />

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
                    visibility: {
                      $eq: Visibility.PUBLIC,
                    },
                    draft: {
                      $eq: false,
                    },
                  },
                ],
              },
            })
          }}
          label={t('navbar.actions.search.fast', { ns: 'common' })}
        />

        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(limit) => setFilters({ ...filters, limit, page: 1 })}
          />
        )}
      </Stack>

      <Grid sx={{ my: 3 }} container columnSpacing={2} rowSpacing={4}>
        {!isFetching
          ? collections.map((collection: Collection) => (
              <Grid key={collection.id} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCard collection={collection} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {collections.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={data?.pageCount!}
          />
        </Box>
      ) : (
        <NoData variant="collections" link="/collections/create" />
      )}
    </Page>
  )
}
