import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
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
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
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
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<LinkFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: parseInt(params.get('page') || '1'),
    limit: 10,
  })

  const { data, isLoading, isFetching } = useGetLinksQuery({
    join: [{ field: 'element.user', select: ['type'] }, { field: 'user' }],
    'element.user.id': user!.id,
    ...filters,
  })

  const links: Element<Link>[] = data?.data || []
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

        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(limit) => setFilters({ ...filters, limit, page: 1 })}
          />
        )}
      </Stack>

      <List sx={{ my: 3 }}>
        {!isFetching
          ? links.map((item: Element<Link>, i: number) => (
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
          : skeletons.map((_, i: number) => (
              <ListItem key={i}>
                <ListItemIcon>
                  <Icon name="eva:link-outline" />
                </ListItemIcon>
                <Skeleton variant="text" width="100%" />
              </ListItem>
            ))}
      </List>

      {links.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={data?.pageCount!}
          />
        </Box>
      ) : (
        <NoData variant="links" link="/links/create" />
      )}
    </Page>
  )
}
