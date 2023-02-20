import { Stack, Tooltip, Link } from '@mui/material'
import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'
import { User } from '@types_/user.type'

import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { NullableTypography } from '../NullableTypography/nullable-typography.component'
import { UserDisplayName } from '../UserDisplayName/user-display-name'
import { Link as RouterLink } from 'react-router-dom'

type CardInformationProps = {
  user:
    | (Pick<User, 'firstName'> &
        Pick<User, 'lastName'> &
        Pick<User, 'avatar'> &
        Pick<User, 'id'>)
    | undefined
  createdDate: Date | string | undefined
}
export const CardInformation = ({
  user,
  createdDate,
}: CardInformationProps) => {
  const displayDate = (date: Date | string | undefined): string | undefined => {
    if (!date) return
    return dayjs(date).format('DD/MM/YYYY')
  }

  const { t } = useTranslation('users')

  return (
    <Tooltip title={t<string>('profile.actions.view')}>
      <Link
        underline="none"
        color="inherit"
        component={RouterLink}
        to={`/users/${user?.id}/profile/videos`}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <UserAvatar
            user={user}
            sx={{
              width: 25,
              height: 25,
            }}
          />
          <Stack
            direction="column"
            spacing={-0.5}
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <UserDisplayName user={user} variant="body2" noWrap />
            <NullableTypography variant="caption">
              {displayDate(createdDate)}
            </NullableTypography>
          </Stack>
        </Stack>
      </Link>
    </Tooltip>
  )
}
