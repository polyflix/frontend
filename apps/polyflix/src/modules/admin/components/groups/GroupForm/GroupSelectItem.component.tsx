import { Avatar, capitalize, Stack, Typography } from '@mui/material'

import { User } from '@users/models/user.model'

interface PropsGroupSelectItem {
  user: User
}
export const GroupSelectItem = ({ user }: PropsGroupSelectItem) => {
  return (
    <Stack direction="row" spacing={1} component="span" alignItems="center">
      <Avatar
        alt={`${user?.firstName} ${user?.lastName}`}
        src={user.avatar}
        sx={{ width: 20, height: 20 }}
      />
      <Stack direction="column" spacing={-1} component="span">
        <Typography variant="body2">
          {capitalize(`${user.firstName} ${user.lastName}`)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 13 }}
        >
          {user.email}
        </Typography>
      </Stack>
    </Stack>
  )
}
