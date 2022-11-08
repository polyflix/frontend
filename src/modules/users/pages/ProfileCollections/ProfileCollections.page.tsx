import { Box, Divider, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionCard } from '@collections/components/CollectionCard/CollectionCard.component'
import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'
import { Collection } from '@collections/models/collection.model'
import { useGetCollectionsQuery } from '@collections/services/collection.service'
import { CollectionFilters } from '@collections/types/filters.type'

type Props = {
  userQuery: any
}

export const ProfileCollectionsPage: React.FC<Props> = ({ userQuery }) => {
  const { t } = useTranslation('users')
  const { data: user } = userQuery
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<CollectionFilters>({
    order: 'createdAt',
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetCollectionsQuery({
    userId: user!.id,
    ...filters,
  })

  const collections: Collection[] = data?.data || []
  const skeletons = buildSkeletons(3)

  let totalPage = Math.ceil((data?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page
      disableGutters={true}
      title={t('profile.tabs.collections.content.title')}
      sx={{ mt: 3 }}
    >
      <Header
        title={t('profile.tabs.collections.content.title')}
        description={t('profile.tabs.collections.content.description')}
      />

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        {/* <Searchbar
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
        /> */}

        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(pageSize) =>
              setFilters({ ...filters, pageSize, page: 1 })
            }
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
            pageCount={totalPage}
          />
        </Box>
      ) : (
        !isLoading && <NoData variant="collections" link="/modules/create" />
      )}
    </Page>
  )
}
