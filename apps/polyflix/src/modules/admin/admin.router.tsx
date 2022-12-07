import { AdminFormCertificatePage } from '@admin/pages/certifications/form/form.page'
import { AdminCertificationPage } from '@admin/pages/certifications/list/list.page'
import { AdminViewCertificationPage } from '@admin/pages/certifications/view/view.page'
import { AdminVideoReportPage } from '@admin/pages/videos/report.page'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { AdminFromGroupPage } from './pages/groups/form/form.page'
import { AdminGroupPage } from './pages/groups/list/list.page'
import { AdminViewGroupPage } from './pages/groups/view/view.page'
import { AdminUserPage } from './pages/users/index.page'
import { AdminVideoPage } from './pages/videos/index.page'

export const AdminRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/users`} component={AdminUserPage} />
      <Route exact path={`${url}/groups`} component={AdminGroupPage} />
      <Route
        path={`${url}/groups/(create|update)/:slug?`}
        component={AdminFromGroupPage}
      />
      <Route path={`${url}/groups/:slug?`} component={AdminViewGroupPage} />
      <Route
        exact
        path={`${url}/certifications`}
        component={AdminCertificationPage}
      />
      <Route
        path={`${url}/certifications/(create|update)/:slug?`}
        component={AdminFormCertificatePage}
      />
      <Route
        path={`${url}/certifications/:slug?`}
        component={AdminViewCertificationPage}
      />

      <Route path={`${url}/videos`} component={AdminVideoPage} />
      <Route path={`${url}/reports`} component={AdminVideoReportPage} />
    </Switch>
  )
}
