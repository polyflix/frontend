import { MoreVert } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Paper,
  Skeleton,
  Stack,
} from '@mui/material'
import { Icon } from 'ui-lib/components'
import { buildSkeletons } from 'utils'

export const GhostList = () => {
  const skeletons = buildSkeletons(5)
  return (
    <List component={Stack} direction="column" gap={1}>
      {skeletons.map((_, i: number) => (
        <ListItem
          key={i}
          component={Paper}
          variant="outlined"
          disablePadding
          secondaryAction={
            <IconButton edge="end" aria-label="comments" disabled={true}>
              <MoreVert />
            </IconButton>
          }
        >
          <ListItemButton disabled={true}>
            <ListItemAvatar>
              <Icon name="eva:npm-fill" />
            </ListItemAvatar>
            <Skeleton animation="wave" width="60%" height={15} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
