import { Edit, MoreVert } from '@mui/icons-material'
import {
  Alert,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TablePagination,
} from '@mui/material'
import { Header } from '../../components/header.component'
import { GhostList } from '../../components/ghost-list.component'
import { Link as RouterLink } from 'react-router-dom'
import { usePopOverModal } from '@studio/hooks/use-pop-over-modal.hook'
import { Icon } from '@core/components/Icon/Icon.component'
import { useGetCoursesQuery } from '@courses/services/course.service'
import { polyflixRouter } from '@core/utils/routes'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const CoursesListPage = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const { data, isLoading, isFetching, isError } = useGetCoursesQuery({
    page,
    pageSize,
  })

  const { PopOver, onClick, handleClose, outputData } = usePopOverModal()

  const { t } = useTranslation('studio')

  const content = () => {
    if (isLoading || isFetching) {
      return <GhostList skeletonsNumber={pageSize} />
    }

    if (isError) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="error">{t('common.errors.global')}</Alert>
        </Box>
      )
    }

    const courses = data?.data || []

    if (courses.length === 0) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="info">{t('courses.noData')}</Alert>
        </Box>
      )
    }

    return (
      <>
        <List component={Stack} direction="column" gap={1} sx={{ pt: 2 }}>
          {courses.map((course: any) => (
            <ListItem
              key={course.id}
              component={Paper}
              variant="outlined"
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => onClick(e, course)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemButton
                component={RouterLink}
                to={polyflixRouter().studio.courses.view(course?.id)}
              >
                <ListItemAvatar>
                  <Icon name="eva:npm-fill" />
                </ListItemAvatar>
                <ListItemText primary={course.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <PopOver>
          <List>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyflixRouter().studio.courses.view(outputData?.id)}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyflixRouter().studio.courses.update(outputData?.id)}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText primary={'Edit'} />
            </ListItemButton>
          </List>
        </PopOver>
      </>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        px: 2,
      }}
    >
      <Header
        title={t('courses.title')}
        description={t('courses.description')}
      />
      {content()}
      <TablePagination
        component="div"
        count={data?.total || 0}
        page={page - 1}
        onPageChange={(e, newPage) => setPage(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage={t('common.informations.rowsPerPage')}
      />
    </Box>
  )
}
