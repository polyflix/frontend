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
} from '@mui/material'
import { Header } from '../../components/header.component'
import { GhostList } from '../../components/ghost-list.component'
import { Link as RouterLink } from 'react-router-dom'
import { usePopOverModal } from '@studio/hooks/use-pop-over-modal.hook'
import { Icon } from '@core/components/Icon/Icon.component'
import { useGetCoursesQuery } from '@courses/services/course.service'
import { polyfilxRouter } from '@core/utils/routes'
import { useTranslation } from 'react-i18next'

export const CoursesListPage = () => {
  const { data, isLoading, isFetching, isError } = useGetCoursesQuery({
    page: 1,
    pageSize: 5,
  })

  const { PopOver, onClick, handleClose, outputData } = usePopOverModal()

  const { t } = useTranslation('studio')

  const content = () => {
    if (isLoading || isFetching) {
      return <GhostList />
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
                to={polyfilxRouter().studio.courses.view(course?.id)}
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
              to={polyfilxRouter().studio.courses.view(outputData?.id)}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyfilxRouter().studio.courses.update(outputData?.id)}
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
    </Box>
  )
}
