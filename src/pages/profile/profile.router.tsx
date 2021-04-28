import { Route, Switch, useRouteMatch } from "react-router-dom";
import Page from "../../components/Page/Page.component";
import { useAuth } from "../../hooks/useAuth.hook";
import NotFoundPage from "../404.page";
import ProfilePage from "./index.page";
import UserVideosPage from "./videos/index.page";

const ProfileRouter = () => {
  const { isLoading } = useAuth();
  const { path } = useRouteMatch();

  if (isLoading) return <Page isLoading={true} />;
  return (
    <Switch>
      <Route exact path={path} component={ProfilePage} />
      <Route exact path={`${path}/videos`} component={UserVideosPage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
};

export default ProfileRouter;
