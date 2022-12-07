import { CertifMenu } from '@admin/components/certifications/CertifMenu.component'
import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import { Add, Groups, MoreVert, School } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Pagination,
  Paper,
  Skeleton,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { NoData } from '@core/components/NoData/NoData.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { Certification } from '@certifications/models/certification.model'
import { useGetCertificationsQuery } from '@certifications/services/certification.service'

export const AdminCertificationPage = () => {
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)

  const ghosts = buildSkeletons(4)

  const {
    isLoading,
    isFetching,
    isError,
    isSuccess,
    data: results,
  } = useGetCertificationsQuery({
    page,
    pageSize,
  })

  const { t } = useTranslation('administration')

  const displayGhost = () => {
    return (
      <Paper variant="outlined">
        <List>
          {ghosts.map((_, i: number) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton disabled>
                  <MoreVert />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <Groups />
                </ListItemIcon>
                <Skeleton animation="wave" width="60%" height={15} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    )
  }
  const displayNoData = () => {
    return (
      <NoData variant="administration" link="/admin/certifications/create" />
    )
  }
  const displayContent = () => {
    return (
      <Paper variant="outlined">
        <List>
          {results?.data?.map((certification: Certification, i: number) => (
            <div key={certification.id}>
              <ListItem
                disablePadding
                secondaryAction={<CertifMenu certification={certification} />}
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/admin/certifications/${certification?.id}`}
                >
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <span>{certification.name}</span>
                  <Box component={'span'} sx={{ flex: '1 0 auto' }}></Box>
                </ListItemButton>
              </ListItem>
              {i !== results?.data?.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </div>
          ))}
        </List>
      </Paper>
    )
  }
  const processContent = () => {
    if (results?.data.length && isSuccess) {
      return displayContent()
    }
    if (isLoading || isFetching) {
      return displayGhost()
    }
    if ((isSuccess && !results?.data?.length) || isError) {
      return displayNoData()
    }
  }

  return (
    <AdminLayout
      pageTitle={t('certifications.page.panel.title')}
      action={
        <Button
          component={RouterLink}
          to={`/admin/certifications/create`}
          startIcon={<Add />}
          variant="contained"
        >
          {t('certifications.page.actions.create')}
        </Button>
      }
    >
      {processContent()}
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          mt: 2,
        }}
      >
        <Pagination
          onChange={(e, p) => setPage(p)}
          count={results?.page}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </AdminLayout>
  )
}
