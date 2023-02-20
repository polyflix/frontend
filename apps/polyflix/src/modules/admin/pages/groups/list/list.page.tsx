import { AdminLayout } from '@admin/layouts/AdminLayout.layout'
import { Group } from '@admin/models/group.model'
import { useGetGroupsQuery } from '@admin/services/group.service'
import { GroupFilters } from '@admin/types/filters.type'
import { Add, Groups, MoreVert } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Pagination,
  Paper,
  Skeleton,
  Tooltip,
} from '@mui/material'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { NoData } from '@core/components/NoData/NoData.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { User } from '@types_/user.type'

import { GroupMenu } from '../../../components/groups/GroupMenu.component'
import { StyledAvatarGroup } from './list.style'

export const AdminGroupPage = () => {
  const [filters, setFilters] = useState<GroupFilters>({
    page: 0,
    size: 10,
  })

  const ghosts = buildSkeletons(4)

  const {
    isLoading,
    isFetching,
    isError,
    isSuccess,
    data: results,
  } = useGetGroupsQuery({
    ...filters,
    page: filters.page == 0 ? filters.page : filters.page - 1,
  })

  const { t } = useTranslation('administration')

  const displayGhost = () => {
    return (
      <Paper variant="outlined">
        <List>
          {ghosts.map((_, i: number) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton disabled>
                  <MoreVert />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <Groups />
                </ListItemIcon>
                <Skeleton animation="wave" width="60%" height={15} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    )
  }
  const displayNoData = () => {
    return <NoData variant="administration" link="/admin/groups/create" />
  }
  const displayContent = () => {
    return (
      <Paper variant="outlined">
        <List>
          {results?.data?.map((group: Group, i: number) => (
            <div key={group.id}>
              <ListItem
                disablePadding
                secondaryAction={<GroupMenu group={group} />}
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/admin/groups/${group?.slug}`}
                >
                  <ListItemIcon>
                    <Groups />
                  </ListItemIcon>
                  <span>{group.name}</span>
                  <Box component={'span'} sx={{ flex: '1 0 auto' }}></Box>

                  <StyledAvatarGroup total={group.members.length}>
                    {group.members.slice(0, 3).map((member: User) => (
                      <Tooltip
                        key={member.id}
                        title={capitalize(
                          `${member.firstName} ${member.lastName}`
                        )}
                      >
                        <Avatar alt="Remy Sharp" src={member.avatar} />
                      </Tooltip>
                    ))}
                  </StyledAvatarGroup>
                </ListItemButton>
              </ListItem>
              {i !== results?.data?.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </div>
          ))}
        </List>
      </Paper>
    )
  }
  const processContent = () => {
    if (results?.data.length && isSuccess) {
      return displayContent()
    }
    if (isLoading || isFetching) {
      return displayGhost()
    }
    if ((isSuccess && !results?.data?.length) || isError) {
      return displayNoData()
    }
  }

  return (
    <AdminLayout
      pageTitle={t('groups.page.panel.title')}
      action={
        <Button
          component={RouterLink}
          to={`/admin/groups/create`}
          startIcon={<Add />}
          variant="contained"
        >
          {t('groups.page.actions.create')}
        </Button>
      }
    >
      {processContent()}
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          mt: 2,
        }}
      >
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={results?.totalPages}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </AdminLayout>
  )
}
