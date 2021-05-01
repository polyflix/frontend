import { AnimatePresence } from "framer-motion";
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
  const { isAuthenticated, isLoading, hasRefresh } = useAuth();

  const location = useLocation();
  const dispatch = useDispatch();

  if (!isAuthenticated && !hasRefresh) {
    dispatch(AuthService.refreshAuth());
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {/* This is temporary awaiting the Hugo MR with Suspense */}
      {isLoading && <div>Refresh auth</div>}
      {!isLoading && (
        <Switch
          location={location}
          key={`${location.pathname}${location.search}`}
        >
          <ProtectedRoute
            hasAccessIf={isAuthenticated}
            exact
            path="/"
            redirectPath="/auth/login"
            component={HomePage}
          />
          <ProtectedRoute
            hasAccessIf={!isAuthenticated}
            redirectPath="/"
            path="/auth"
            component={AuthRouter}
          />
          <ProtectedRoute
            hasAccessIf={isAuthenticated}
            path="/profile"
            redirectPath="/auth/login"
            component={ProfileRouter}
          />
          <ProtectedRoute
            hasAccessIf={isAuthenticated}
            path="/videos"
            redirectPath="/auth/login"
            component={VideoRouter}
          />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      )}
    </AnimatePresence>
  );
};

export default IndexRouter;
