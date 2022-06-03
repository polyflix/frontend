import {
  Box,
  Pagination,
  List,
  ListItem,
  Checkbox,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Skeleton,
} from '@mui/material'
import { useState } from 'react'
import { UseFieldArrayReturn } from 'react-hook-form'

import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

import { ICollectionForm } from '@collections/types/form.type'

type VideoListProps = {
  fieldArray: UseFieldArrayReturn<ICollectionForm, 'elements', 'id'>
}

export const VideoList = ({ fieldArray }: VideoListProps) => {
  const { user } = useAuth()

  const [filters, setFilters] = useState<VideoFilters>({
    authorId: user?.id,
    page: 1,
    pageSize: 10,
  })

  const { data: videos } = useGetVideosQuery({
    ...filters,
  })

  const { fields, append, remove } = fieldArray

  const handleToggle = (video: Video) => () => {
    const currentIndex = fields.findIndex((e) => e.id === video.id)

    if (currentIndex === -1) {
      append({
        id: video.id,
        name: video.title,
        thumbnail: video.thumbnail,
      })
    } else {
      remove(currentIndex)
    }
  }
  const isVideoSelected = (video: Video) =>
    fields.some((e) => e.id === video.id)

  let totalPage = Math.ceil((videos?.totalCount ?? 1) / (filters.pageSize ?? 1))

  const ghosts = buildSkeletons(3)

  return (
    <>
      <List>
        {videos
          ? videos?.items.map((item: Video) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(item)}
                    checked={isVideoSelected(item)}
                  />
                }
                disablePadding
              >
                <ListItemButton onClick={handleToggle(item)}>
                  <ListItemAvatar>
                    <Avatar alt="video thumbnail" src={item.thumbnail} />
                  </ListItemAvatar>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))
          : ghosts.map((_, i: number) => (
              <ListItem
                key={i}
                secondaryAction={<Checkbox edge="end" disabled />}
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt="video thumbnail" />
                  </ListItemAvatar>
                  <Skeleton animation="wave" width="60%" height={15} />
                </ListItemButton>
              </ListItem>
            ))}
      </List>
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={totalPage < 1 ? 1 : totalPage}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}
