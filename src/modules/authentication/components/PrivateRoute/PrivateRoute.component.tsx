import React, { PropsWithChildren } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'

interface Props {
  condition: boolean
  redirectTo?: string
}

/**
 * Wrapper for <Route> that redirects to a defined path,
 * by default will redirect to /auth/login if nothing specified as a fallback
 *
 * As Route, you can use either children or component to render stuff
 * Children will also be preferred against component!
 */
export const PrivateRoute = ({
  children,
  condition,
  redirectTo = '/auth/login',
  component,
  ...rest
}: PropsWithChildren<Props & RouteProps>) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (condition) {
          if (children) return children
          else if (component) return React.createElement(component)
          else
            throw new Error(
              'Could not render empty private route, neither children or component provided'
            )
        } else {
          return (
            <Redirect
              to={{
                pathname: redirectTo || '/auth/login',
                state: { from: location },
              }}
            />
          )
        }
      }}
    />
  )
}
