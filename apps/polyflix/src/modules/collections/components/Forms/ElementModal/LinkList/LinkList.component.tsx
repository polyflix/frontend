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

import { Visibility } from '@types_/resources/content.type'
import { Element } from '@types_/resources/element.type'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Link } from '@links/models/link.model'
import { useGetLinksQuery } from '@links/services/link.service'
import { LinkFilters } from '@links/types/filters.type'

import { ICollectionForm } from '@collections/types/form.type'

type LinkListProps = {
  fieldArray: UseFieldArrayReturn<ICollectionForm, 'elements', 'id'>
}

export const LinkList = ({ fieldArray }: LinkListProps) => {
  const { user } = useAuth()

  const [filters, setFilters] = useState<LinkFilters>({
    'user.id': user?.id,
    page: 1,
    limit: 10,
  })

  // Fetch the links
  const { data: links } = useGetLinksQuery({
    join: [
      {
        field: 'element.user',
        select: ['firstName', 'lastName', 'avatar'],
      },
      { field: 'questions', select: ['label'] },
    ],
    'element.visibility': Visibility.PUBLIC,
    ...filters,
  })

  const { fields, append, remove } = fieldArray

  const handleToggle = (link: Element<Link>) => () => {
    const currentIndex = fields.findIndex((e) => e.id === link.id)

    if (currentIndex === -1) {
      append({
        id: link.id,
        name: link.name,
      })
    } else {
      remove(currentIndex)
    }
  }

  const isLinkSelected = (link: Element<Link>) =>
    fields.some((e) => e.id === link.id)

  const ghosts = buildSkeletons(3)

  return (
    <>
      <List>
        {links
          ? links?.data.map((item: Element<Link>) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(item)}
                    checked={isLinkSelected(item)}
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
          count={links?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}
