import { CursusCard } from '@cursus/components/CursusCard/CursusCard.component'
import { Cursus } from '@cursus/models/cursus.model'
import { useGetAllCursusQuery } from '@cursus/services/cursus.service'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'

export const ExploreCursusPage = () => {
  const { t } = useTranslation('cursus')
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState({
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
    draft: false,
  })

  const { data, isLoading, isFetching } = useGetAllCursusQuery(filters)

  const allCursus: Cursus[] = data?.data ?? []
  const skeletons = buildSkeletons(3)

  let totalPage = Math.ceil((data?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page title={t('explore.title')} isLoading={isLoading}>
      <Grid container spacing={3}>
        <Grid item md={12} lg={8}>
          <Stack spacing={3}>
            <Typography variant="h1">
              <Trans
                i18nKey="explore.bodyTitle"
                ns={'cursus'}
                components={{
                  colored: (
                    <Box component={'div'} sx={{ color: 'primary.light' }} />
                  ),
                }}
              />
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: '400', color: 'text.secondary' }}
            >
              {t('explore.description')}
            </Typography>
          </Stack>
        </Grid>

        {!isFetching
          ? allCursus.map((cursus: Cursus) => (
              <Grid item xs={12} sm={6} lg={4} key={cursus.id}>
                <CursusCard cursus={cursus} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {allCursus.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={totalPage}
          />
        </Box>
      ) : (
        <NoData variant="cursus" link="/cursus/create" />
      )}
    </Page>
  )
}
