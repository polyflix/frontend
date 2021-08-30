import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ProfilePage } from './profile/index.page';
import { UserVideosPage } from './videos/index.page';
import { UserCollectionsPage } from './collections/index.page';
import { UserVideosHistoryPage } from './videos/history.page';
import { UserCoursesPage } from './courses/index.page';
import { UserPathsPage } from './paths/index.page';
import { PasswordUpdatePage } from './profile/password.page';
import { DeleteAccountPage } from './profile/delete.page';
import { UserSubtitleImprovementPage } from './subtitles/subtitle-improvement.page';

export const ProfileRouter = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ProfilePage} />
      <Route exact path={`${path}/password`} component={PasswordUpdatePage} />
      <Route exact path={`${path}/delete`} component={DeleteAccountPage} />
      <Route
        path={`${path}/videos/history`}
        component={UserVideosHistoryPage}
      />
      <Route path={`${path}/videos/:id`} component={UserVideosPage} />
      <Route path={`${path}/courses/:id`} component={UserCoursesPage} />
      <Route path={`${path}/collections/:id`} component={UserCollectionsPage} />
      <Route path={`${path}/paths/:id`} component={UserPathsPage} />
      <Route
        path={`${path}/subtitles/:id`}
        component={UserSubtitleImprovementPage}
      />
    </Switch>
  );
};
