import { useAuth } from "@core/hooks/useAuth.hook";
import { AuthService } from "@core/services/auth/auth.service";
import { useInjection } from "@modules/di";
import ProtectedRoute from "@ui/components/ProtectedRoute/ProtectedRoute.component";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation } from "react-router-dom";
import NotFoundPage from "./404.page";
import AuthRouter from "./auth/auth.router";
import HomePage from "./home.page";
import ProfileRouter from "./profile/profile.router";
import VideoRouter from "./videos/video.router";

const IndexRouter = () => {
  const authService = useInjection<AuthService>(AuthService);

  const { isAuthenticated, isLoading, hasRefresh } = useAuth();

  const location = useLocation();

  if (!isAuthenticated && !hasRefresh) {
    authService.refreshAuth();
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {/* This is temporary awaiting the Hugo's MR with Suspense */}
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
          <Route component={NotFoundPage} />
        </Switch>
      )}
    </AnimatePresence>
  );
};

export default IndexRouter;
