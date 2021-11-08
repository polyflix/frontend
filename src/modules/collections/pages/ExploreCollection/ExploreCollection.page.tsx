import { Divider, Stack, Grid, Pagination, Box } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
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
  const [filters, setFilters] = useState<CollectionFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: 1,
    limit: 10,
  })

  const { data, isLoading, isFetching } = useGetCollectionsQuery({
    join: [{ field: 'elements', select: ['type'] }],
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

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
          label={t('search')}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>

      <Grid sx={{ my: 3 }} container columnSpacing={2} rowSpacing={4}>
        {!isFetching
          ? data?.data.map((item: Collection) => (
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
          count={data?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Page>
  )
}
