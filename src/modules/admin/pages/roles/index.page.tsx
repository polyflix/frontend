import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetRolesQuery } from '@roles/services/role.service'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'

import { AdminLayout } from '../../layouts/AdminLayout.layout'

const columns = (t: TFunction): GridColDef[] => [
  {
    field: 'name',
    headerName: t('roles.page.panel.fields.name'),
    width: 300,
  },
  {
    field: 'permissions',
    headerName: t('roles.page.panel.fields.permissions'),
    width: 300,
    valueGetter: (params) => params.row.permissions.length,
  },
]

export const AdminRolePage = () => {
  const { t } = useTranslation('administration')

  const { data, isLoading } = useGetRolesQuery()

  return (
    <AdminLayout pageTitle={t('roles.page.panel.title')}>
      <div style={{ height: '500px', width: '100%', background: 'white' }}>
        <DataGrid
          getRowId={(row) => row.name}
          isRowSelectable={() => false}
          loading={isLoading}
          rows={data || []}
          columns={columns(t)}
          pageSize={10}
          rowsPerPageOptions={[10, 30, 50, 100]}
          // onPageChange={setPage}
          // onPageSizeChange={setPageSize}
        />
      </div>
    </AdminLayout>
  )
}
