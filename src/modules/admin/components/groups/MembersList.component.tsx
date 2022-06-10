import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  Stack,
} from '@mui/material'
import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

import { User } from '@users/models/user.model'

type PropsMemberList = {
  members: User[]
}

export const MembersList = ({ members }: PropsMemberList) => {
  const { t } = useTranslation('administration')

  return (
    <List>
      {members.map((member: User, i: number) => (
        <div key={member.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt={`${member.firstName} ${member.lastName}`}
                src={member.avatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={capitalize(`${member.firstName} ${member.lastName}`)}
              secondary={
                <Stack direction="row" spacing={1} component="span">
                  {member?.roles?.map((role: string, index: number) => (
                    <Chip
                      key={index}
                      component="span"
                      variant="outlined"
                      color="primary"
                      label={t(`roles.${role.toLocaleLowerCase()}`, {
                        ns: 'common',
                      })}
                      size="small"
                    />
                  ))}
                </Stack>
              }
            />
          </ListItem>
          {i !== members.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </div>
      ))}
    </List>
  )
}
