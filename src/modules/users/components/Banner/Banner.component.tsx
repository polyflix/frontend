import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { DEFAULT_AVATAR_PICTURE } from '@core/constants/defaultValue.constant'

import { User } from '@users/models/user.model'

import { BannerHead } from './Banner.style'

interface Props {
  user: User
}

export const Banner = ({ user }: Props) => {
  const { t } = useTranslation('users')

  return (
    <>
      <Typography sx={{ mb: 2 }} align="left" variant="h3">
        {t('profile.title.view') + user?.firstName}
      </Typography>
      <BannerHead elevation={6}>
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
          src={user?.profilePicture || DEFAULT_AVATAR_PICTURE}
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
        <Tabs
          sx={{ alignSelf: 'start' }}
          variant="scrollable"
          scrollButtons={false}
          aria-label="scrollable prevent tabs example"
        >
          {/* // TODO: i18n */}
          <Tab label="Profil" />
          <Tab label="Vidéos" />
          <Tab label="Collections" />
          <Tab label="Groupes" />
        </Tabs>
      </BannerHead>
    </>
  )
}
