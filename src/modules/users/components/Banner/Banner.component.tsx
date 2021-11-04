import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'

import { User } from '@users/models/user.model'

import { BannerHead } from './Banner.style'

const BannerTabs = () => {
  const { t } = useTranslation('users')
  const routeMatch = useRouteMatch({
    path: [
      '/users/profile',
      '/users/profile/videos',
      '/users/profile/collections',
      '/users/profile/groups',
      '/users/profile/quizzes',
    ],
    exact: true,
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
        label={t('profile.tabs.profile')}
        value="/users/profile"
        to="/users/profile"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.videos.title')}
        value="/users/profile/videos"
        to="/users/profile/videos"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.collections.title')}
        value="/users/profile/collections"
        to="/users/profile/collections"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.groups.title')}
        value="/users/profile/groups"
        to="/users/profile/groups"
        component={RouterLink}
      />
      <Tab
        label={t('profile.tabs.quizzes.title')}
        value="/users/profile/quizzes"
        to="/users/profile/quizzes"
        component={RouterLink}
      />
    </Tabs>
  )
}

interface Props {
  user: User
}

export const ProfileBanner = ({ user }: Props) => {
  const { t } = useTranslation('users')

  return (
    <>
      <BannerHead variant="outlined">
        {/* // TODO Allow editing only on user's profile */}
        <Tooltip title={t<string>('profile.actions.edit')}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              margin: 1,
              color: 'primary.main',
            }}
            component={RouterLink}
            to="profile/settings"
          >
            <Icon name="eva:edit-fill" />
          </IconButton>
        </Tooltip>
        <Avatar
          src={user?.profilePicture}
          alt={user.displayName + ' profile picture.'}
          sx={{ width: 100, height: 100, borderRadius: 10 }}
        />
        <Box
          sx={{
            paddingTop: 1,
            paddingBottom: 4,
          }}
        >
          <Typography align="center" variant="h4">
            {user.displayName}
          </Typography>
          <Typography align="center" variant="body1">
            {user.email}
          </Typography>
        </Box>
        <BannerTabs />
      </BannerHead>
    </>
  )
}
