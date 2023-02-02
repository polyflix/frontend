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
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { polyfilxRouter } from '@core/utils/routes'

export const QuizzesListPage = () => {
  const { data, isLoading, isFetching, isError } = useGetQuizzesQuery({
    page: 1,
    pageSize: 5,
  })

  const { PopOver, onClick, handleClose, outputData } = usePopOverModal()

  const content = () => {
    if (isLoading || isFetching) {
      return <GhostList />
    }

    if (isError) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="error">
            Something went wrong. Please try again later.
          </Alert>
        </Box>
      )
    }

    const quizzes = data?.data || []

    if (quizzes.length === 0) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="info">
            No quizzes found. Please create a new one.
          </Alert>
        </Box>
      )
    }

    return (
      <>
        <List component={Stack} direction="column" gap={1} sx={{ pt: 2 }}>
          {quizzes.map((quizz: any) => (
            <ListItem
              key={quizz.id}
              component={Paper}
              variant="outlined"
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => onClick(e, quizz)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemButton
                component={RouterLink}
                to={polyfilxRouter().studio.quizzes.view(quizz?.id)}
              >
                <ListItemAvatar>
                  <Icon name="eva:npm-fill" />
                </ListItemAvatar>
                <ListItemText primary={quizz.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <PopOver>
          <List>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyfilxRouter().studio.quizzes.view(outputData?.id)}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyfilxRouter().studio.quizzes.update(outputData?.id)}
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
      <Header title="Quizzes" description="List of quizzes" />
      {content()}
    </Box>
  )
}
