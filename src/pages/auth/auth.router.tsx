import { Route, Switch, useRouteMatch } from "react-router-dom";
import NotFoundPage from "../404.page";
import LoginPage from "./login.page";
import RegisterPage from "./register.page";

const AuthRouter = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/login`} component={LoginPage} />
      <Route exact path={`${path}/register`} component={RegisterPage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
};

export default AuthRouter;
