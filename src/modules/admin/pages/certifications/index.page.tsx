import { EditCertificationModal } from '@admin/components/certifications/EditCertificationModal'
import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Certification } from '@certifications/models/certification.model'
import { useGetCertificationsQuery } from '@certifications/services/certification.service'

const columns = (t: TFunction): GridColDef[] => [
  {
    field: 'id',
    headerName: t('certifications.page.panel.fields.certificationID'),
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    width: 300,
    hideable: true,
    renderCell: (params) => `${capitalize(params.row.id) || ''}`,
  },
  {
    field: 'name',
    headerName: t('certifications.page.panel.fields.name'),
    sortable: true,
    width: 300,
    editable: true,
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
    <AdminLayout
      pageTitle={t('certifications.page.panel.title')}
      action={
        <Button
          onClick={() => setSelected({ id: undefined, name: '' })}
          startIcon={<Add />}
          variant="contained"
        >
          {t('certifications.page.actions.create')}
        </Button>
      }
    >
      <EditCertificationModal
        onClose={() => setSelected(undefined)}
        key={selected?.id}
        certification={selected}
      />
      <DataGrid
        sx={{
          height: '80vh',
          width: '100%',
        }}
        getRowId={(row) => row.id}
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
    </AdminLayout>
  )
}
