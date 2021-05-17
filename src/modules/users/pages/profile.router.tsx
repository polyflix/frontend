import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ProfilePage } from "./index.page";
import { ProfileRedirector } from "./profile.redirect";

export const ProfileRouter = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ProfilePage} />
      <Route
        path={[`${path}/videos`, `${path}/:id`]}
        component={ProfileRedirector}
      />
    </Switch>
  );
};
