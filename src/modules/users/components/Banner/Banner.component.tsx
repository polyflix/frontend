import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'

import {
  getUserFullname,
  getUsernameToDisplay,
} from '@users/helpers/displayUsername.helper'
import { User } from '@users/models/user.model'

import { UserAvatar } from '../UserAvatar/UserAvatar.component'
import { BannerHead } from './Banner.style'

const BannerTabs = () => {
  const { t } = useTranslation('users')
  const routeMatch = useRouteMatch({
    path: [
      '/users/profile/videos',
      '/users/profile/courses',
      '/users/profile/modules',
      '/users/profile/groups',
      '/users/profile/quizzes',
      '/users/profile/attachments',
      '/users/profile/certifications',
    ],
  })
  const currentTab = routeMatch?.path

  return (
    <Tabs
      value={currentTab}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="profile tabs"
      sx={{
        width: '100%',
        '.MuiTabs-flexContainer': {
          justifyContent: {
            sm: 'center',
          },
        },
      }}
    >
      <Tab
        label={t('profile.tabs.videos.title')}
        value="/users/profile/videos"
        to="/users/profile/videos"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.courses.title')}
        value="/users/profile/courses"
        to="/users/profile/courses"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.collections.title')}
        value="/users/profile/modules"
        to="/users/profile/modules"
        component={RouterLink}
      />
      {/* <Tab
        label={t('profile.tabs.groups.title')}
        value="/users/profile/groups"
        to="/users/profile/groups"
        component={RouterLink}
      /> */}
      <Tab
        label={t('profile.tabs.quizzes.title')}
        value="/users/profile/quizzes"
        to="/users/profile/quizzes"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.attachments.title')}
        value="/users/profile/attachments"
        to="/users/profile/attachments"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.certifications.title')}
        value="/users/profile/certifications"
        to="/users/profile/certifications"
        component={RouterLink}
      />
    </Tabs>
  )
}

interface Props {
  user: User
}

export const ProfileBanner = ({ user }: Props) => {
  return (
    <>
      <BannerHead variant="outlined">
        <UserAvatar
          user={user}
          sx={{ width: 100, height: 100, borderRadius: 10 }}
        />
        <Box
          sx={{
            paddingTop: 1,
            paddingBottom: 4,
            alignItems: 'center',
            display: 'grid',
          }}
        >
          <Typography align="center" variant="h4">
            {getUserFullname(user)}
          </Typography>
          <Typography align="center" margin="auto" variant="body1" color="gray">
            {user.username != user.email && getUsernameToDisplay(user!)}
          </Typography>
        </Box>
        <BannerTabs />
      </BannerHead>
    </>
  )
}
