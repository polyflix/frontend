import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.component";
import { useAuth } from "../hooks/useAuth.hook";
import { AuthService } from "../services/auth.service";
import NotFoundPage from "./404.page";
import AuthRouter from "./auth/auth.router";
import HomePage from "./home.page";
import ProfileRouter from "./profile/profile.router";
import VideoRouter from "./videos/video.router";

const IndexRouter = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  const [hasSentRefresh, setHasSentRefresh] = useState<boolean>(false);

  if (!isAuthenticated && !hasSentRefresh) {
    AuthService.refreshAuth(dispatch).finally(() => setHasSentRefresh(true));
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch
        location={location}
        key={`${location.pathname}${location.search}`}
      >
        <Route exact path="/" component={HomePage} />
        <ProtectedRoute
          hasAccessIf={!isAuthenticated}
          redirectPath="/"
          path="/auth"
          component={AuthRouter}
        />
        <ProtectedRoute
          hasAccessIf={isAuthenticated}
          path="/profile"
          component={ProfileRouter}
        />
        <Route path="/videos" component={VideoRouter} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </AnimatePresence>
  );
};

export default IndexRouter;
