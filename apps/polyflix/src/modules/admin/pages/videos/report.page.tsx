import { ManageReportModal } from '@admin/components/videos/ManageReportModal.component'
import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import { Chip, ChipProps, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ReportModel, ReportState } from '@videos/models/report.model'
import { useGetReportsQuery } from '@shared/services/resources/videos/video.service'

export const AdminVideoReportPage = () => {
  // Pagination state
  const [, /*page*/ setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(99)
  const [selected, setSelected] = useState<ReportModel>()
  const { t } = useTranslation('administration')
  const { t: t2 } = useTranslation('videos')

  const columns: GridColDef[] = [
    {
      field: 'videoTitle',
      headerName: t('video.page.panel.fields.title'),
      width: 400,
      renderCell: (params) => (
        <Typography sx={{ mr: 1 }}>{params.row.__video__.title}</Typography>
      ),
    },
    {
      field: 'reason',
      headerName: t('report.page.panel.fields.reason'),
      width: 400,
      renderCell: (params) => (
        <Typography sx={{ mr: 1 }}>
          {t2(`report.reasons.${params.row.reason}`)}
        </Typography>
      ),
    },
    {
      field: 'state',
      headerName: t('report.page.panel.fields.state'),
      width: 200,
      renderCell: (params) => {
        let props: ChipProps

        switch (params.row.state) {
          case ReportState.PENDING:
            props = {
              color: 'error',
              label: t('report.page.panel.fields.states.pending'),
            }
            break
          case ReportState.APPROVED:
            props = {
              color: 'success',
              label: t('report.page.panel.fields.states.approved'),
            }
            break
          case ReportState.REJECTED:
            props = {
              color: 'warning',
              label: t('report.page.panel.fields.states.rejected'),
            }
            break
        }

        return <Chip {...props} />
      },
    },
  ]

  const { isLoading, isFetching, data } = useGetReportsQuery()

  const totalElements = data?.totalCount || 0
  const reports = data?.items || []

  return (
    <AdminLayout pageTitle={t('report.page.panel.title')}>
      <ManageReportModal
        onClose={() => setSelected(undefined)}
        key={`${selected?.userId}-${selected?.videoId}`}
        report={selected}
      />
      <DataGrid
        sx={{
          height: '80vh',
          width: '100%',
          '& .MuiDataGrid-row': { cursor: 'pointer' },
        }}
        isRowSelectable={() => false}
        loading={isLoading || isFetching}
        rows={reports}
        getRowId={(row) => `${row.userId}-${row.videoId}`}
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
