import { Chip, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'

import { EditVideoModal } from '../../components/videos/EditVideoModal.component'
import { AdminLayout } from '../../layouts/AdminLayout.layout'

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 400 },
  {
    field: 'author',
    headerName: 'Author',
    width: 200,
    renderCell: (params) => (
      <>
        <Typography sx={{ mr: 1 }}>{params.row.publisher.firstName} {params.row.publisher.lastName}</Typography>
      </>
    ),
  },
  {
    field: 'draft',
    headerName: 'Draft',
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
    headerName: 'Visibility',
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
    field: '',
  }
]

export const AdminVideoPage = () => {
  // Pagination state
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selected, setSelected] = useState<Video>()
  const { t } = useTranslation('administration')

  const { isLoading, isFetching, data } = useGetVideosQuery({ page, pageSize })

  const totalElements = data?.totalCount || 0
  const videos = data?.items || []

  // map slug to id
  const videosWithId = videos.map((video: Video) => ({
    ...video,
    id: video.slug,
  }))

  return (
    <AdminLayout pageTitle={t('video.page.panel.title')}>
      <EditVideoModal video={selected} />
      <div style={{ height: '500px', width: '100%', background: 'white' }}>
        <DataGrid
          isRowSelectable={() => false}
          loading={isLoading || isFetching}
          rows={videosWithId}
          onRowClick={(params) => setSelected(params.row)}
          rowCount={totalElements}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10]}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </AdminLayout>
  )
}