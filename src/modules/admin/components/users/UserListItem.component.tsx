import React from 'react'

import { User } from '../../../users/models/user.model'

type Props = {
  user: User
  onDelete?: () => void // commented to simplify upgrade
  ownerItems?: boolean
  links?: boolean
}

export const UsersListItem: React.FC<Props> = ({ user }) => {
  return (
    <tr>
      <td className="border border-black px-3 py-2"> {user.displayName} </td>
      <td className="border border-black px-3 py-2">
        {user.isAccountActivated.toString()}
      </td>
      <td className="border border-black px-3 py-2">
        {user.isAdmin.toString()}
      </td>
      <td className="border border-black px-3 py-2">{user.email}</td>
    </tr>
  )
}
