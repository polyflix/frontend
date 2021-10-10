import { PropsWithChildren } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface Props {
  condition: boolean
  redirectTo?: string
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export const PrivateRoute = ({
  children,
  condition,
  redirectTo,
  ...rest
}: PropsWithChildren<Props & RouteProps>) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        condition ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo || '/auth/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
