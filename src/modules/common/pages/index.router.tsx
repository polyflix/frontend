import { AnimatePresence } from "framer-motion";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useAuth } from "../../authentication/hooks/useAuth.hook";
import { AuthRouter } from "../../authentication/pages/auth.router";
import { AuthService } from "../../authentication/services/auth.service";
import { useInjection } from "@polyflix/di";
import { Spinner } from "../../ui/components/Spinner/Spinner.component";
import { ProfileRouter } from "../../users/pages/profile.router";
import { VideoRouter } from "../../videos/pages/video.router";
import { CollectionRouter } from "../../collections/pages/collection.router";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute.component";
import { NotFoundPage } from "./404.page";
import { HomePage } from "./home.page";
import { useServerState } from "../hooks/useServerState.hook";
import { ServerState } from "../types/serverState.type";
import { ServerUnavailablePage } from "./503.page";
import { CourseRouter } from "../../courses/pages";

export const IndexRouter: React.FC = () => {
  const { isAuthenticated, isLoading, hasRefresh } = useAuth();
  const serverState = useServerState();

  const location = useLocation();

  const authService = useInjection<AuthService>(AuthService);
  if (!isAuthenticated && !hasRefresh) {
    authService.refreshAuth();
  }

  if (serverState === ServerState.OFFLINE) return <ServerUnavailablePage />;

  return (
    <AnimatePresence exitBeforeEnter>
      {isLoading && (
        <Spinner page className="w-screen h-screen dark:bg-black" />
      )}
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
          <ProtectedRoute
            hasAccessIf={isAuthenticated}
            path="/collections"
            redirectPath="/auth/login"
            component={CollectionRouter}
          />
          <ProtectedRoute
            hasAccessIf={isAuthenticated}
            path="/courses"
            redirectPath="/auth/login"
            component={CourseRouter}
          />
          <Route component={NotFoundPage} />
        </Switch>
      )}
    </AnimatePresence>
  );
};
