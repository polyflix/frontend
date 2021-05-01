import { Route, Switch, useRouteMatch } from "react-router-dom";
import LoginPage from "./login.page";
import RegisterPage from "./register.page";

const AuthRouter = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/login`} component={LoginPage} />
      <Route exact path={`${path}/register`} component={RegisterPage} />
    </Switch>
  );
};

export default AuthRouter;
