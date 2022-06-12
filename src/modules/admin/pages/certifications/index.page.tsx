import { EditCertificationModal } from '@admin/components/certifications/EditCertificationModal'
import { Button, Tooltip } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Certification } from '@certifications/models/certification.model'
import { useGetCertificationsQuery } from '@certifications/services/certification.service'

import { AdminLayout } from '../../layouts/AdminLayout.layout'

const columns = (t: TFunction): GridColDef[] => [
  {
    field: 'certificationID',
    headerName: t('certifications.page.panel.fields.certificationID'),
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => `${capitalize(params.row.certificationID) || ''}`,
  },
  {
    field: 'name',
    headerName: t('certifications.page.panel.fields.name'),
    sortable: true,
    width: 160,
    valueGetter: (params) => `${capitalize(params.row.name) || ''}`,
  },
]

export const AdminCertificationPage = () => {
  // Pagination state
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selected, setSelected] = useState<Certification>()
  const { t } = useTranslation('administration')

  let { isLoading, isFetching, data } = useGetCertificationsQuery({
    page,
    pageSize,
  })

  const totalElements = data?.total || 0
  const certifications = data?.data || []

  return (
    <AdminLayout pageTitle={t('certifications.page.panel.title')}>
      <EditCertificationModal
        onClose={() => setSelected(undefined)}
        key={selected?.certificationID}
        certification={selected}
      />
      <DataGrid
        sx={{
          height: '80vh',
          width: '100%',
        }}
        getRowId={(row) => row.certificationID}
        isRowSelectable={() => false}
        loading={isLoading || isFetching}
        rows={certifications}
        onRowClick={(params) => {
          setSelected(params.row)
        }}
        rowCount={totalElements}
        columns={columns(t)}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 30, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <Tooltip title={t<string>('navbar.actions.logout')}>
        <Button
          onClick={() => setSelected({ certificationID: undefined, name: '' })}
        >
          Create
        </Button>
      </Tooltip>
    </AdminLayout>
  )
}
