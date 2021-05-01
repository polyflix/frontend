import { Route, Switch, useRouteMatch } from "react-router-dom";
import CreateUpdateVideoPage from "./[create|update].page";
import VideoDetail from "./[slug].page";

const VideoRouter = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateVideoPage}
      />
      <Route path={`${path}/:slug`} component={VideoDetail} />
    </Switch>
  );
};

export default VideoRouter;
