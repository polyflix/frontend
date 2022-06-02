import { Chip } from '@mui/material'
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
    field: 'roles',
    headerName: 'Roles',
    width: 200,
    sortable: false,
    renderCell: (params) => (
      <>
        {params.row.roles.map((role: string, index: number) => (
          <Chip
            key={index}
            label={capitalize(role)}
            variant="outlined"
            color="primary"
          />
        ))}
      </>
    ),
  },
]

export const AdminVideoPage = () => {
  // Pagination state
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selected, setSelected] = useState<Video>()
  const { t } = useTranslation('administration')

  const { isLoading, isFetching, data } = useGetVideosQuery({ page, pageSize })

  const totalElements = data?.totalCount || 0
  const videos = data?.items || []

  return (
    <AdminLayout pageTitle={t('video.page.panel.title')}>
      <EditVideoModal video={selected} />
      <div style={{ height: '500px', width: '100%', background: 'white' }}>
        <DataGrid
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
      </div>
    </AdminLayout>
  )
}
