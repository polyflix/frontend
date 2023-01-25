import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { StudioHome } from './home/StudioHome'

export const StudioRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${url}`} component={StudioHome} />
    </Switch>
  )
}
