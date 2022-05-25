import { useKeycloak } from '@react-keycloak/web'
import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'

import { AuthService } from '@auth/services/auth.service'

import { User } from '@users/models/user.model'

const RedirectPage: React.FC = () => {
  const authService = useInjection<AuthService>(AuthService)
  const history = useHistory<any>()
  const { initialized, keycloak } = useKeycloak()
  if (!initialized) return <LoadingLayout />

  // Load the user data from backend
  // TODO
  const user: User = {
    id: '1',
    email: 'test@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://www.remove.bg/images/remove_image_background.jpg',
    isAccountActivated: true,
    isAdmin: true,
    displayName: 'test',
  }

  // Store the user data in the state
  if (keycloak.token) {
    authService.storeUser(keycloak.token, user)
    history.push('/')
  }

  return (
    <div>
      <h1 className="text-black text-4xl">Welcome to the Protected Page.</h1>
      <pre>
        <code>{JSON.stringify(keycloak, null, ' ')}</code>
      </pre>
    </div>
  )
}

export default RedirectPage
