import { Delete } from '@mui/icons-material'
import {
  Stack,
  Typography,
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'

import { Collection } from '@collections/models/collection.model'
import { useDeleteCollectionMutation } from '@collections/services/collection.service'

const DESCRIPTION_LENGTH = 50

type CollectionListItemProps = {
  collection: Collection
  newCollections: string[]
  handleToggle: (collection: Collection, status?: boolean) => void
  isLinkSelected: (collection: Collection) => boolean
}

export const CollectionListItem = ({
  collection,
  handleToggle,
  isLinkSelected,
  newCollections,
}: CollectionListItemProps) => {
  const { t } = useTranslation('courses')
  const [deleteCollection] = useDeleteCollectionMutation()
  const { Modal: ConfirmModal, onClick: onClickConfirmModal } = useConfirmModal(
    {
      title: t('deleteModal.title', { ns: 'collections' }),
      content: t('deleteModal.content', { ns: 'collections' }),
      onCancel: () => {},
      onConfirm: () => {
        handleToggle(collection, false)
        deleteCollection({ slug: collection.slug })
      },
    }
  )

  const shortDescription = () => {
    if (collection.description.length > DESCRIPTION_LENGTH) {
      return `${collection.description.slice(0, DESCRIPTION_LENGTH - 3)}...`
    }
    return collection.description
  }

  return (
    <>
      <ConfirmModal />
      <ListItem
        secondaryAction={
          <Stack direction="row" spacing={1}>
            <Checkbox
              edge="end"
              onChange={() => handleToggle(collection)}
              checked={isLinkSelected(collection)}
            />
            <Tooltip title={t<string>('form.upsert.deleteModule')}>
              <IconButton
                edge="end"
                color="error"
                aria-label="delete"
                onClick={onClickConfirmModal}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        disablePadding
      >
        <ListItemButton onClick={() => handleToggle(collection)}>
          <ListItemAvatar>
            <Avatar>{collection.name[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <Typography>{collection.name}</Typography>
                {newCollections.includes(collection.id) && (
                  <Chip
                    label="New"
                    size="small"
                    color="success"
                    sx={{ color: 'white' }}
                  />
                )}
              </Stack>
            }
            secondary={shortDescription()}
          />
        </ListItemButton>
      </ListItem>
    </>
  )
}
