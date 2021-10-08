import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

type Props = RouteProps & {
  /** The component to render when acces is authorized */
  component: any
  /** The condition to match to let the user navigate to the route */
  hasAccessIf: boolean
  /** The redirect path where to redirect the user if the condition is false */
  redirectPath?: string
}

/**
 * A component to create protected routes.
 */
export const ProtectedRoute: React.FC<Props> = ({
  component,
  hasAccessIf,
  redirectPath,
  ...rest
}) => {
  const routeComponent = (props: any) =>
    hasAccessIf ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: redirectPath ?? '/' }} />
    )
  return <Route {...rest} render={routeComponent} />
}
