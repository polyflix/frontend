import { Divider, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { Certificate } from '@certifications/models/certification.model'
import { useGetMyCertificateQuery } from '@certifications/services/certification.service'
import { CertificationFilters } from '@certifications/types/filters.type'

import {
  ProfileCertificationsListItem,
  ProfileCertificationsListItemSkeleton,
} from './ProfileCertificationsListItem.component'

export const ProfileCertificationsPage = () => {
  const { t } = useTranslation('users')

  const { page } = useParams<{ page: string }>()

  const [filters, setFilters] = useState<Partial<CertificationFilters>>({
    page: parseInt(page || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetMyCertificateQuery({
    ...filters,
  })

  const certificates: Certificate[] = data?.data || []
  const skeletons = buildSkeletons(4)

  return (
    <Page
      disableGutters={true}
      sx={{ mt: 3 }}
      title={t('profile.tabs.certifications.content.title')}
    >
      <Stack justifyContent="space-between" direction="row">
        <Header
          title={t('profile.tabs.certifications.content.title')}
          description={t('profile.tabs.certifications.content.description')}
        />
      </Stack>
      <Divider sx={{ my: 3 }} />

      {/* If there is more than 10 items, we display a limit item per page selector */}
      <Stack justifyContent="space-between" direction="row">
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(pageSize) =>
              setFilters({ ...filters, pageSize, page: 1 })
            }
          />
        )}
      </Stack>

      <Grid sx={{ my: 3 }} container spacing={2}>
        {!isFetching
          ? certificates.map((certificate: Certificate, i: number) => (
              <Grid key={certificate.id} item xs={12} lg={6}>
                <ProfileCertificationsListItem
                  key={i}
                  certificate={certificate}
                />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} lg={6}>
                <ProfileCertificationsListItemSkeleton />
              </Grid>
            ))}
      </Grid>

      {certificates.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={data?.pageCount!}
          />
        </Box>
      ) : (
        !isLoading && <NoData variant="none" />
      )}
    </Page>
  )
}
