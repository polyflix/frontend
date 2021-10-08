import { useInjection } from '@polyflix/di'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { AdminRouter } from '../../admin/pages/admin.router'
import { useAuth } from '../../authentication/hooks/useAuth.hook'
import { AuthRouter } from '../../authentication/pages/auth.router'
import ValidatePage from '../../authentication/pages/validate.page'
import { AuthService } from '../../authentication/services/auth.service'
import { CollectionRouter } from '../../collections/pages/collection.router'
import { CourseRouter } from '../../courses/pages'
import { GroupsRouter } from '../../groups/pages/groups.router'
import { PathRouter } from '../../paths/pages'
import { QuizzesRouter } from '../../quizzes/pages/quizzes.router'
import { SubtitleRouter } from '../../subtitles/pages/subtitle.router'
import { TagsRouter } from '../../tags/pages/tags.router'
import { Spinner } from '../../ui/components/Spinner/Spinner.component'
import { ProfileRouter } from '../../users/pages/profile.router'
import { VideoRouter } from '../../videos/pages/video.router'
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute.component'
import { useServerState } from '../hooks/useServerState.hook'
import { ServerState } from '../types/serverState.type'
import { ForbiddenPage } from './403.page'
import { NotFoundPage } from './404.page'
import { ServerUnavailablePage } from './503.page'
import { HomePage } from './home.page'

export const IndexRouter: React.FC = () => {
  const { isAuthenticated, isLoading, hasRefresh, user } = useAuth()
  const serverState = useServerState()
  const location = useLocation()

  const authService = useInjection<AuthService>(AuthService)

  if (!isAuthenticated && !hasRefresh) {
    authService.refreshAuth()
  }

  if (serverState === ServerState.OFFLINE) return <ServerUnavailablePage />

  const redirectPath = !isAuthenticated
    ? '/auth/login'
    : !user?.isAccountActivated
    ? '/auth/validate'
    : '/'
  const hasAccessIf = isLoading
    ? false
    : isAuthenticated && (user?.isAccountActivated || false)
  const commonProps = {
    hasAccessIf,
    redirectPath,
  }
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
            path="/auth/:confirmUserAccountId?/validate"
            {...{
              ...commonProps,
              hasAccessIf: isAuthenticated && !user?.isAccountActivated,
            }}
            component={ValidatePage}
          />
          <ProtectedRoute
            exact
            path="/"
            {...commonProps}
            component={HomePage}
          />
          <ProtectedRoute
            {...{ ...commonProps, hasAccessIf: !isAuthenticated }}
            path="/auth"
            component={AuthRouter}
          />
          <ProtectedRoute
            path="/profile"
            {...commonProps}
            component={ProfileRouter}
          />
          <ProtectedRoute
            path="/groups"
            {...commonProps}
            component={GroupsRouter}
          />

          <ProtectedRoute
            path="/(watch|videos)"
            {...commonProps}
            component={VideoRouter}
          />

          <ProtectedRoute
            path="/collections"
            {...commonProps}
            component={CollectionRouter}
          />
          <ProtectedRoute
            path="/paths"
            {...commonProps}
            component={PathRouter}
          />
          <ProtectedRoute
            path="/courses"
            {...commonProps}
            component={CourseRouter}
          />
          <ProtectedRoute
            hasAccessIf={isAuthenticated}
            path="/403"
            redirectPath="/auth/login"
            component={ForbiddenPage}
          />
          <ProtectedRoute
            {...commonProps}
            path="/quizzes"
            component={QuizzesRouter}
          />
          <ProtectedRoute
            {...commonProps}
            path="/subtitle-editing"
            component={SubtitleRouter}
          />
          <ProtectedRoute
            {...commonProps}
            path="/search"
            component={TagsRouter}
          />
          <ProtectedRoute
            hasAccessIf={isAuthenticated && (user?.isAdmin || false)}
            path="/admin"
            redirectPath="/403"
            component={AdminRouter}
          />
          <Route component={NotFoundPage} />
        </Switch>
      )}
    </AnimatePresence>
  )
}
