import { EditVideoModal } from '@admin/components/videos/EditVideoModal.component'
import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import { Chip, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Video } from '@videos/models/video.model'
import { useGetAdminVideosQuery } from '@videos/services/video.service'

export const AdminVideoPage = () => {
  // Pagination state
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(99)
  const [selected, setSelected] = useState<Video>()
  const { t } = useTranslation('administration')

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: t('video.page.panel.fields.title'),
      width: 400,
    },
    {
      field: 'author',
      headerName: t('video.page.panel.fields.author'),
      width: 200,
      renderCell: (params) => (
        <>
          <Typography sx={{ mr: 1 }}>
            {params.row.publisher.firstName} {params.row.publisher.lastName}
          </Typography>
        </>
      ),
    },
    {
      field: 'draft',
      headerName: t('video.page.panel.fields.draft'),
      width: 100,
      renderCell: (params) => (
        <Chip
          label={capitalize(params.row.draft)}
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'visibility',
      headerName: t('video.page.panel.fields.visibility'),
      width: 100,
      renderCell: (params) => (
        <Chip
          label={capitalize(params.row.visibility)}
          variant="outlined"
          color="primary"
        />
      ),
    },
  ]

  const { isLoading, isFetching, data } = useGetAdminVideosQuery({
    page,
    pageSize,
  })

  const totalElements = data?.totalCount || 0
  const videos = data?.items || []

  return (
    <AdminLayout pageTitle={t('video.page.panel.title')}>
      <EditVideoModal key={selected?.id} video={selected} />
      <DataGrid
        sx={{
          height: '80vh',
          width: '100%',
        }}
        isRowSelectable={() => false}
        loading={isLoading || isFetching}
        rows={videos}
        onRowClick={(params) => setSelected(params.row)}
        rowCount={totalElements}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10]}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </AdminLayout>
  )
}
