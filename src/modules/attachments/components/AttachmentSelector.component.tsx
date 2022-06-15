import {
  Avatar,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Control,
  useFieldArray,
  UseFieldArrayReturn,
  UseFormRegister,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Icon } from '@core/components/Icon/Icon.component'
import { getCommonTextFieldProps } from '@core/helpers/form.helper'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { IVideoForm } from '@videos/types/form.type'

import { getDomain } from '@attachments/helpers/favicon.helper'
import { Attachment } from '@attachments/models/attachment.model'
import { AttachmentParams } from '@attachments/models/attachment.params'
import { useGetUserAttachmentsQuery } from '@attachments/services/attachment.service'

import { AttachmentModal } from './AttachmentModal.component'

const MAX_ATTACHMENTS_BY_PAGE = 200 // TODO : handle pagination
const CURRENT_OFFSET = 0

interface Props {
  attachments: UseFieldArrayReturn<IVideoForm, 'attachments', 'id'>
  videoId?: string
}
export const AttachmentSelector = ({ attachments, videoId }: Props) => {
  const { user } = useAuth()
  const { t } = useTranslation('videos')
  const [isModalOpened, setIsModalOpened] = useState(false)

  const [filters, setFilters] = useState<AttachmentParams>({
    offset: CURRENT_OFFSET,
    limit: MAX_ATTACHMENTS_BY_PAGE,
    userId: user!.id,
  })

  const { data, isLoading, isFetching, refetch } =
    useGetUserAttachmentsQuery(filters)

  const { fields, append, remove } = attachments

  const handleToggle = (attachment: Attachment) => () => {
    console.log(attachment)

    const currentIndex = fields.findIndex((e) => e.id === attachment.id)

    if (currentIndex === -1) {
      append(attachment)
    } else {
      remove(currentIndex)
    }
  }

  useEffect(() => {
    if (videoId && data) {
      console.log(videoId, data)

      for (const a of data.items) {
        if (a.videos.includes(videoId)) {
          console.log(a.title)

          append(a)
        }
      }
    }
  }, [videoId, data])
  console.log(fields)

  const isLinkSelected = (attachment: Attachment) =>
    fields.some((e) => e.id === attachment.id)

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">
          {t('forms.create-update.title.attachments')}
        </Typography>
        <IconButton onClick={() => setIsModalOpened(true)} color="primary">
          <Icon name="carbon:add" size={30} />
        </IconButton>
      </Stack>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {t('forms.create-update.description.attachments')}
      </Typography>
      <List>
        {data &&
          data.items.map((attachment) => (
            <ListItem
              key={attachment.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(attachment)}
                  checked={isLinkSelected(attachment)}
                />
              }
            >
              <ListItemButton onClick={handleToggle(attachment)}>
                <ListItemAvatar>
                  <Avatar src={`${getDomain(attachment.url)}/favicon.ico`}>
                    <Icon name="akar-icons:link-chain" size={30} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={attachment.title} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <AttachmentModal
        open={isModalOpened}
        onClose={() => {
          setIsModalOpened(false)
        }}
        onSubmit={() => {
          refetch()
          setIsModalOpened(false)
        }}
      />
      {/* {fields.length === 0 && (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('forms.create-update.placeholder.attachments.empty')}
        </Typography>
      )}
      {fields.map((item, index) => {
        return (
          <Stack direction="row" key={item.id} alignItems="center">
            <IconButton color="primary" onClick={() => remove(index)}>
              <Icon name="ic:round-clear" />
            </IconButton>
          </Stack>
        )
      })} */}
    </Stack>
  )
}
