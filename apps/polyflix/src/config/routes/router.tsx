import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'

// Routers
import { QuizzRouter } from '@quizzes/quizzes.router'
import { VideoRouter } from '@videos/video.router'
import { CollectionRouter } from '@collections/collection.router'
import { CourseRouter } from '@courses/course.router'
import { UserRouter } from '@users/user.router'
import { AuthRouter } from '@auth/auth.router'
import { StudioRouter } from '@studio/studio.router'

// Layout
import { StudioLayout } from '@layouts/Studio/StudioLayout'
import { DashboardLayout } from '@layouts/Dashboard/Dashboard.layout'

// Types
import { Role } from '@types_/roles.type'

// Pages
import { NotFoundPage } from '@app/pages/404.page'
import { HomePage } from '@app/pages/Home.page'
import { CertificatePage } from '@certifications/pages/Certificate.page'

// hooks
import { useRoles } from '@core/hooks/useRoles.hook'

type RouterProps = {
  isAuthenticated: boolean
  wantedUri: string
}

export const Router = ({ isAuthenticated, wantedUri }: RouterProps) => {
  const { hasRoles } = useRoles()

  return (
    <BrowserRouter>
      <Switch>
        {/* We want the user to be redirected if already logged in or not */}
        <Route
          path="/auth"
          render={() => (
            <AuthRouter
              isAuthenticated={isAuthenticated}
              redirectUrl={wantedUri}
            />
          )}
        />
        <Route path="/certificate/:id" component={CertificatePage} />
        <PrivateRoute
          condition={
            isAuthenticated && hasRoles([Role.Admin, Role.Contributor])
          }
          path="/studio"
        >
          <Switch>
            <StudioLayout>
              <Route path="/studio" component={StudioRouter} />
            </StudioLayout>
          </Switch>
        </PrivateRoute>
        {/* We restrict these route to an authenticated user*/}
        <PrivateRoute condition={isAuthenticated}>
          <DashboardLayout>
            <Switch>
              <Route path="/courses" component={CourseRouter} />
              <Route path="/quizzes" component={QuizzRouter} />
              <Route path="/users" component={UserRouter} />
              <Route path="/videos" component={VideoRouter} />
              <Route path="/modules" component={CollectionRouter} />
              <Route exact path="/" component={HomePage} />
              <Route component={NotFoundPage} />
              {/* <PrivateRoute
                condition={user?.roles.includes(Role.Admin) || false}
                >
                <Route path="/admin" component={AdminRouter} />
              </PrivateRoute> */}
            </Switch>
          </DashboardLayout>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}
