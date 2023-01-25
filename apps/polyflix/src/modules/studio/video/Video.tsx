import { Edit, MoreVert } from '@mui/icons-material'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material'
import { Header } from '../components/header.component'
import { GhostList } from '../components/ghost-list.component'
import { Link as RouterLink } from 'react-router-dom'
import { useGetVideosQuery } from '@videos/services/video.service'
import { Visibility } from '@core/models/content.model'
import { Icon } from '@core/components/Icon/Icon.component'
import { usePopOverModal } from '@core/hooks/use-pop-over-modal.hook'

const Video = () => {
  const filters = {
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-createdAt',
  }
  const { data, isLoading, isFetching } = useGetVideosQuery({
    page: 1,
    pageSize: 5,
    ...filters,
  })

  const { PopOver, onClick, handleClose, outputData } = usePopOverModal()

  const content = () => {
    if (isLoading || isFetching) {
      return <GhostList />
    }

    const videos = data?.items || []

    return (
      <>
        <List component={Stack} direction="column" gap={1}>
          {videos.map((video: any) => (
            <ListItem
              key={video.id}
              component={Paper}
              variant="outlined"
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => onClick(e, video)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemButton component={RouterLink} to={`view/${video.id}`}>
                <ListItemAvatar>
                  <Icon name="eva:npm-fill" />
                </ListItemAvatar>
                <ListItemText primary={video.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <PopOver>
          <List>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={`view/${outputData?.id}`}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={`form/${outputData?.id}`}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText primary={'Edit'} />
            </ListItemButton>
          </List>
        </PopOver>
      </>
    )
  }

  return (
    <Box>
      <Header title="Videos" description="List of videos" />
      {content()}
    </Box>
  )
}

export default Video
