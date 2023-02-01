import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { CoursesListPage } from './pages/courses/courses-list.page'
import { CreateUpdateCoursePage } from './pages/courses/[create-update].page'
import { StudioHome } from './pages/home/StudioHome'
import { QuizzesListPage } from './pages/quizzes/quizzes-list.page'
import { CreateUpdateQuizzPage } from './pages/quizzes/[create-update].page'
import { VideosListPage } from './pages/videos/videos-list.page'
import { CreateUpdateVideoPage } from './pages/videos/[create-update].page'

export const StudioRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${url}`} component={StudioHome} />
      <Route path={`${url}/videos`} component={VideosRouter} />
      <Route path={`${url}/quizzes`} component={QuizzesRouter} />
      <Route path={`${url}/courses`} component={CoursesRouter} />
    </Switch>
  )
}

export const VideosRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={url} component={VideosListPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdateVideoPage}
      />
    </Switch>
  )
}
export const QuizzesRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={url} component={QuizzesListPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdateQuizzPage}
      />
    </Switch>
  )
}
export const CoursesRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={url} component={CoursesListPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdateCoursePage}
      />
    </Switch>
  )
}
