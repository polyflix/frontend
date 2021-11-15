import { Delete } from '@mui/icons-material'
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import React from 'react'

import { DragDropItemProps } from '@core/components/FieldArrayDragDropWrapper/FieldArrayDragDropWrapper.component'

export const CollectionDragDrop: React.FC<DragDropItemProps> = ({
  provided,
  snapshot,
  onEvent,
  field,
}) => {
  return (
    <List
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{
        backgroundColor: snapshot.isDragging
          ? 'background.paper'
          : 'transparent',
        border: snapshot.isDragging ? 1 : 0,
        borderStyle: 'dashed',
        borderRadius: 1,
      }}
    >
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            color="error"
            aria-label="delete"
            onClick={() => onEvent('remove')}
          >
            <Delete />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar src={field.thumbnail} />
        </ListItemAvatar>
        <ListItemText primary={field.name} />
      </ListItem>
    </List>
  )
}
