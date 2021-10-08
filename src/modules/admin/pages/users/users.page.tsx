import React from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import { Container } from '../../../ui/components/Container/Container.component'
import { Jumbotron } from '../../../ui/components/Jumbotron/Jumbotron.component'
import { Page } from '../../../ui/components/Page/Page.component'
import { User } from '../../../users'
import { UsersListItem } from '../../components/users/UserListItem.component'
import { useUsers } from '../../hooks/users/use-users.hook'

export const AdminUserPage: React.FC = () => {
  const { t } = useTranslation()

  const { data, isLoading: isLoadingUser, alert } = useUsers()
  if (isLoadingUser) console.log(data)

  if (alert && alert.type === 'not-found') return <Redirect to="/not-found" />

  return (
    <Page title={t('admin.onBoarding.users.title')}>
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t('admin.onBoarding.users.title')}
          content={t('admin.onBoarding.question')}
        />
        <div className="mt-5 col-span-12 rounded-md p-8">
          {data && (
            <table className="text-white bg-gray-100 bg-opacity-5 table-auto md:content-around ">
              <thead className="border-b-3 border-red-600">
                <tr>
                  <th className="px-3 py-2"> Name </th>
                  <th className="px-3 py-2"> IsActivated </th>
                  <th className="px-3 py-2"> IsAdmin </th>
                  <th className="px-3 py-2"> email </th>
                </tr>
              </thead>
              <tbody>
                {data.map((user: User) => (
                  <UsersListItem key={user.id} user={user} ownerItems={false} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Container>
    </Page>
  )
}
