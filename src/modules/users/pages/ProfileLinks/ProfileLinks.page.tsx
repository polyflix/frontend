import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Stack,
  Typography,
  Skeleton,
  ListItemIcon,
  IconButton,
} from '@mui/material'
import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { Element } from '@core/models/element.model'
import { SnackbarService } from '@core/services/snackbar.service'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { buildLinkSearch } from '@links/helpers/search.helper'
import { Link } from '@links/models/link.model'
import { useGetLinksQuery } from '@links/services/link.service'
import { LinkFilters } from '@links/types/filters.type'

import { LinkListMenuMenu } from '@users/components/LinkListMenu/LinkListMenu.component'

export const ProfileLinksPage = () => {
  const { t } = useTranslation('users')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { user } = useAuth()
  const [filters, setFilters] = useState<LinkFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: 1,
    limit: 10,
  })

  const {
    data: links,
    isLoading,
    isFetching,
  } = useGetLinksQuery({
    join: [{ field: 'element.user', select: ['type'] }, { field: 'user' }],
    'element.user.id': user!.id,
    ...filters,
  })

  const skeletons = buildSkeletons(3)

  return (
    <Page isLoading={isLoading} sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('profile.tabs.links.content.title')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: {
                $and: [
                  ...buildLinkSearch(search),
                  {
                    'element.user.id': {
                      $eq: user!.id,
                    },
                  },
                ],
              },
            })
          }}
          label={t('navbar.actions.search.fast', { ns: 'common' })}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>

      <List sx={{ my: 3 }}>
        {!isFetching ? (
          links?.data?.length ? (
            links?.data.map((item: Element<Link>, i: number) => (
              <ListItem
                key={i}
                secondaryAction={<LinkListMenuMenu link={item} />}
              >
                <ListItemIcon>
                  <CopyToClipboard
                    onCopy={() => {
                      snackbarService.createSnackbar(
                        t('profile.tabs.links.content.list.clipboard'),
                        {
                          variant: 'success',
                        }
                      )
                    }}
                    text={item.data.url}
                  >
                    <IconButton>
                      <Icon name="eva:link-outline" />
                    </IconButton>
                  </CopyToClipboard>
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))
          ) : (
            <NoData variant="links" link="/links/create" />
          )
        ) : (
          skeletons.map((_, i: number) => (
            <ListItem key={i}>
              <ListItemIcon>
                <Icon name="eva:link-outline" />
              </ListItemIcon>
              <Skeleton variant="text" width="100%" />
            </ListItem>
          ))
        )}
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
    </Page>
  )
}
