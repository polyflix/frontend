import { Box, Divider, List, Stack, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { AttachmentModal } from '@attachments/components/AttachmentModal.component'
import { AttachmentParams } from '@attachments/models/attachment.params'
import { useGetUserAttachmentsQuery } from '@attachments/services/attachment.service'

import {
  ProfileAttachmentListItem,
  ProfileAttachmentSkeleton,
} from './ProfileAttachmentListItem.component'

const DEFAULT_PAGE_SIZE = 10

export const ProfileAttachmentsPage = () => {
  const { mode, attachmentId, page } =
    useParams<{ mode?: string; attachmentId?: string; page?: string }>()

  const history = useHistory()

  const { t: tUsers } = useTranslation('users')
  const { t: tAttachments } = useTranslation('attachments')
  const { user } = useAuth()

  const [filters, setFilters] = useState<AttachmentParams>({
    page: parseInt(page || '1'),
    pageSize: DEFAULT_PAGE_SIZE,
    userId: user!.id,
  })

  const { data, isLoading, isFetching, refetch } =
    useGetUserAttachmentsQuery(filters)

  const [isModalOpened, setIsModalOpened] = useState(false)

  const skeletons = buildSkeletons(3)

  useEffect(() => {
    if (mode === 'update' && !attachmentId)
      return history.push('/users/profile/attachments/create')
    if (mode) setIsModalOpened(true)
  }, [mode, attachmentId])

  const onCreate = () => {
    history.push('/users/profile/attachments/create')
  }

  return (
    <Page
      disableGutters={true}
      sx={{ mt: 3 }}
      title={tUsers('profile.tabs.attachments.content.title')}
    >
      <Stack
        justifyContent="space-between"
        direction="row"
        sx={{ alignItems: 'center' }}
      >
        <Header
          title={tUsers('profile.tabs.attachments.content.title')}
          description={tUsers('profile.tabs.attachments.content.description')}
        />
        <Box>
          <Tooltip
            title={tAttachments<string>('forms.create-update.title.create')}
          >
            <IconButton onClick={onCreate} color="primary">
              <Icon name="carbon:add" size={30} />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>

      {isModalOpened && (
        <AttachmentModal
          attachmentId={attachmentId}
          open={isModalOpened}
          onClose={() => {
            setIsModalOpened(false)
            history.push('/users/profile/attachments')
          }}
          onSubmit={() => {
            refetch()
            setIsModalOpened(false)
            history.push('/users/profile/attachments')
          }}
        />
      )}

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        {data?.totalCount! > DEFAULT_PAGE_SIZE && (
          <ItemsPerPage
            onChange={(pageSize) =>
              setFilters({ ...filters, pageSize, page: 1 })
            }
          />
        )}
      </Stack>

      <List sx={{ my: 3 }}>
        {!isFetching
          ? data?.items.map((item, i) => (
              <ProfileAttachmentListItem
                key={i}
                attachment={item}
                onDelete={refetch}
              />
            ))
          : skeletons.map((_, i) => <ProfileAttachmentSkeleton key={i} />)}
      </List>

      {!isLoading &&
        (data &&
        data.items.length > 0 &&
        data.items.length < data.totalCount ? (
          <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
            <PaginationSynced
              filters={filters}
              setFilters={setFilters}
              pageCount={Math.ceil(data?.totalCount / filters.pageSize)}
            />
          </Box>
        ) : (
          !data ||
          (data.items.length === 0 && (
            <NoData
              variant="attachments"
              link="/users/profile/attachments/create"
            />
          ))
        ))}
    </Page>
  )
}
