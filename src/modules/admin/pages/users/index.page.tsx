import { Avatar, Chip, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { User } from '@users/models/user.model'
import { useGetUsersQuery } from '@users/services/user.service'

import { EditUserModal } from '../../components/users/EditUserModal.component'
import { AdminLayout } from '../../layouts/AdminLayout.layout'

const columns = (user: User, t: TFunction): GridColDef[] => [
  {
    field: 'avatar',
    headerName: t('users.page.panel.fields.avatar'),
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => (
      <Avatar sx={{ width: 32, height: 32 }} src={params.row.avatar} />
    ),
  },
  {
    field: 'fullName',
    headerName: t('users.page.panel.fields.fullName'),
    sortable: true,
    width: 160,
    valueGetter: (params) =>
      `${capitalize(params.row.firstName) || ''} ${
        capitalize(params.row.lastName) || ''
      }`,
  },
  {
    field: 'email',
    headerName: t('users.page.panel.fields.email'),
    width: 400,
    renderCell: (params) => (
      <>
        <Typography sx={{ mr: 1 }}>{params.row.email}</Typography>
        {params.row.id === user.id && (
          <Chip
            color="success"
            label={t('users.page.panel.you')}
            size="small"
          />
        )}
      </>
    ),
  },
  {
    field: 'roles',
    headerName: t('users.page.panel.fields.roles'),
    width: 600,
    sortable: false,
    renderCell: (params) => (
      <>
        {params.row.roles.map((role: string) => (
          <Chip key={role} label={role} variant="outlined" color="primary" />
        ))}
      </>
    ),
  },
]

export const AdminUserPage = () => {
  // Pagination state
  const { user } = useAuth()
  const [pageSize, setPageSize] = useState<number>(10)
  const [selected, setSelected] = useState<User>()
  const { t } = useTranslation('administration')

  const { isLoading, isFetching, data } = useGetUsersQuery({
    page: 0,
    pageSize: 9999,
  })

  const totalElements = data?.totalElements || 0
  const users = data?.data || []

  return (
    <AdminLayout pageTitle={t('users.page.panel.title')}>
      <EditUserModal
        onClose={() => setSelected(undefined)}
        key={selected?.id}
        user={selected}
      />
      <div style={{ height: '500px', width: '100%', background: 'white' }}>
        <DataGrid
          isRowSelectable={() => false}
          loading={isLoading || isFetching}
          rows={users}
          onRowClick={(params) => {
            setSelected(params.row)
          }}
          rowCount={totalElements}
          columns={columns(user!, t)}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 30, 50, 100]}
          onPageSizeChange={setPageSize}
        />
      </div>
    </AdminLayout>
  )
}
