import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Skeleton,
  ListItemIcon,
  IconButton,
  Paper,
  Link,
} from '@mui/material'
import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { SnackbarService } from '@core/services/snackbar.service'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Attachment } from '@attachments/models/attachment.model'
import { AttachmentParams } from '@attachments/models/attachment.params'
import { useGetUserAttachmentsQuery } from '@attachments/services/attachment.service'

import { AttachmentListMenu } from '@users/components/AttachmentListMenu/AttachmentListMenu.component'

const MAX_ATTACHMENTS_BY_PAGE = 10

export const ProfileAttachmentsPage = () => {
  const { t } = useTranslation('users')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { user } = useAuth()
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<AttachmentParams>({
    offset: parseInt(params.get('page') || '0'),
    limit: MAX_ATTACHMENTS_BY_PAGE,
    userId: user!.id,
  })

  const { data, isLoading, isFetching } = useGetUserAttachmentsQuery(filters)

  const skeletons = buildSkeletons(3)

  return (
    <Page
      disableGutters={true}
      sx={{ mt: 3 }}
      title={t('profile.tabs.attachments.content.title')}
    >
      <Header
        title={t('profile.tabs.attachments.content.title')}
        description={t('profile.tabs.attachments.content.description')}
      />

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.totalCount! > MAX_ATTACHMENTS_BY_PAGE && (
          <ItemsPerPage
            onChange={(limit) =>
              setFilters({ ...filters, limit, offset: MAX_ATTACHMENTS_BY_PAGE })
            }
          />
        )}
      </Stack>

      <List sx={{ my: 3 }}>
        {!isFetching
          ? data?.items.map((item: Attachment, i: number) => (
              <ListItem
                key={i}
                secondaryAction={<AttachmentListMenu attachment={item} />}
                component={Paper}
                variant="outlined"
                sx={{ mb: 1 }}
              >
                <ListItemIcon>
                  <CopyToClipboard
                    onCopy={() => {
                      snackbarService.createSnackbar(
                        t('profile.tabs.attachments.content.list.clipboard'),
                        {
                          variant: 'success',
                        }
                      )
                    }}
                    text={item.url}
                  >
                    <IconButton>
                      <Icon name="eva:link-outline" />
                    </IconButton>
                  </CopyToClipboard>
                </ListItemIcon>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener"
                  color="inherit"
                  underline="hover"
                >
                  <ListItemText primary={item.title} />
                </Link>
              </ListItem>
            ))
          : skeletons.map((_, i: number) => (
              <ListItem
                key={i}
                component={Paper}
                variant="outlined"
                sx={{ mb: 1 }}
              >
                <ListItemIcon>
                  <Icon name="eva:link-outline" />
                </ListItemIcon>
                <Skeleton variant="text" width="100%" />
              </ListItem>
            ))}
      </List>

      {data && data.items.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={Math.ceil(data.totalCount / MAX_ATTACHMENTS_BY_PAGE)}
          />
        </Box>
      ) : (
        !isLoading && <NoData variant="links" link="/links/create" />
      )}
    </Page>
  )
}
