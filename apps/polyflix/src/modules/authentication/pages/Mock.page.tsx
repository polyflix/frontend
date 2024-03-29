import { AuthLayout } from '@auth/layouts/Auth.layout'
import { AuthService } from '@auth/services/auth.service'
import { Box, Button, Container, Typography } from '@mui/material'
import { useInjection } from '@polyflix/di'
import { useKeycloak } from '@react-keycloak/web'
import { User } from '@types_/user.type'

import { BaseUsers } from 'mock-server'
import { Redirect } from 'react-router-dom'

interface Props {
  redirectUri: string
}

export function MockAuthenticationPage({ redirectUri: redirectUri }: Props) {
  const authService = useInjection<AuthService>(AuthService)
  let { keycloak } = useKeycloak()

  function login(user: User, redirectUrl: string = '/') {
    keycloak.subject = user.id
    authService
      .getUser()
      .catch(console.error)
      .finally(() => {
        keycloak.token = 'my-mock-token'
        return <Redirect to={redirectUrl} />
      })
  }

  return (
    <>
      <AuthLayout />

      <Container
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h2">Hi Polyflix developer 👋!</Typography>
        <Typography sx={{ my: 4 }} variant="body1">
          You see this page because you have ve enabled the mock server. The
          mock server allows you to work on the application without the needs of
          having an up and running backend. You will need to choose a user below
          to access the application :
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {BaseUsers.map((user) => (
            <Button
              sx={{ mr: 3 }}
              variant="contained"
              onClick={() => login(user as unknown as User, redirectUri)}
              key={user.id}
            >
              Use app as {user.username}
            </Button>
          ))}
        </Box>
      </Container>
    </>
  )
}
