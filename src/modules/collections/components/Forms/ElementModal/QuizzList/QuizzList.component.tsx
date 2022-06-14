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

import { Visibility } from '@core/models/content.model'
import { Element } from '@core/models/element.model'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

import { ICollectionForm } from '@collections/types/form.type'

type QuizzListProps = {
  fieldArray: UseFieldArrayReturn<ICollectionForm, 'elements', 'id'>
}

export const QuizzList = ({ fieldArray }: QuizzListProps) => {
  const { user } = useAuth()

  const [filters, setFilters] = useState<QuizzFilters>({
    userId: user?.id,
    page: 1,
    pageSize: 10,
    visibility: Visibility.PUBLIC,
  })

  // Fetch the quizzes
  const { data: quizzes } = useGetQuizzesQuery(filters)

  const { fields, append, remove } = fieldArray

  const handleToggle = (quizz: Element<Quizz>) => () => {
    const currentIndex = fields.findIndex((e) => e.id === quizz.id)

    if (currentIndex === -1) {
      append({
        id: quizz.id,
        name: quizz.name,
      })
    } else {
      remove(currentIndex)
    }
  }

  const isQuizzSelected = (quizz: Element<Quizz>) =>
    fields.some((e) => e.id === quizz.id)

  const ghosts = buildSkeletons(3)

  return (
    <>
      <List>
        {quizzes
          ? quizzes?.data.map((item: Element<Quizz>) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(item)}
                    checked={isQuizzSelected(item)}
                  />
                }
                disablePadding
              >
                <ListItemButton onClick={handleToggle(item)}>
                  <ListItemAvatar>
                    <Avatar>{item.name}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
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
          count={quizzes?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}
