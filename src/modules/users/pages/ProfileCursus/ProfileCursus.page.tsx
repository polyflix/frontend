import { CursusCard } from '@cursus/components/CursusCard/CursusCard.component'
import { Cursus } from '@cursus/models/cursus.model'
import { useGetAllCursusQuery } from '@cursus/services/cursus.service'
import { CursusFilters } from '@cursus/types/filters.type'
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

import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'

export const ProfileCursusPage = () => {
  const { t } = useTranslation('users')
  const { user } = useAuth()
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<CursusFilters>({
    order: 'createdAt',
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetAllCursusQuery({
    userId: user!.id,
    ...filters,
  })

  const cursus: Cursus[] = data?.data || []
  const skeletons = buildSkeletons(3)
  let totalPage = Math.ceil((data?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page
      disableGutters={true}
      title={t('profile.tabs.cursus.content.title')}
      sx={{ mt: 3 }}
    >
      <Header
        title={t('profile.tabs.cursus.content.title')}
        description={t('profile.tabs.cursus.content.description')}
      />

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
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
          ? cursus.map((item: Cursus) => (
              <Grid key={item.id} item xs={12} sm={6} md={6} lg={4}>
                <CursusCard cursus={item} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {cursus.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={totalPage}
          />
        </Box>
      ) : (
        !isLoading && <NoData variant="cursus" link="/cursus/create" />
      )}
    </Page>
  )
}
