import { Theme } from '@mui/material'
import { merge } from 'lodash'

import { Avatar } from './Avatar.component'
import { Button } from './Button.component'
import { Menu } from './Menu.component'
import { Typography } from './Typography.component'

export const ComponentsOverrides = (theme: Theme) => {
  return merge(Typography(theme), Avatar(theme), Button(), Menu(theme))
}
