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
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { polyflixRouter } from '@routes/index'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const QuizzesListPage = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const { data, isLoading, isFetching, isError } = useGetQuizzesQuery({
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

    const quizzes = data?.data || []

    if (quizzes.length === 0) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="info">{t('quizzes.noData')}</Alert>
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
                to={polyflixRouter().studio.quizzes.view(quizz?.id)}
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
              to={polyflixRouter().studio.quizzes.view(outputData?.id)}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyflixRouter().studio.quizzes.update(outputData?.id)}
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
        title={t('quizzes.title')}
        description={t('videos.description')}
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
