import { Edit, MoreVert } from '@mui/icons-material'
import {
  Alert,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material'
import { Header } from '../../components/header.component'
import { GhostList } from '../../components/ghost-list.component'
import { Link as RouterLink } from 'react-router-dom'
import { useGetVideosQuery } from '@videos/services/video.service'
import { usePopOverModal } from '@studio/hooks/use-pop-over-modal.hook'
import { Icon } from '@core/components/Icon/Icon.component'
import { polyflixRouter } from '@core/utils/routes'
import { useTranslation } from 'react-i18next'
import { ImageCover } from '@core/components/ImageCover/image-cover.component'
import { Video } from '@videos/models/video.model'
import { abbreviateNumber } from 'js-abbreviation-number'
import { useState } from 'react'

export const VideosListPage = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const { data, isLoading, isFetching, isError } = useGetVideosQuery({
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

    const videos = data?.items || []

    if (videos.length === 0) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="info">{t('videos.noData')}</Alert>
        </Box>
      )
    }

    return (
      <>
        <List component={Stack} direction="column" gap={1} sx={{ pt: 2 }}>
          {videos.map((video: Video) => (
            <ListItem
              key={video.id}
              component={Paper}
              variant="outlined"
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => onClick(e, video)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <Tooltip
                title={'ID: ' + video.id}
                placement="top"
                arrow
                disableFocusListener
              >
                <ListItemButton
                  component={RouterLink}
                  to={polyflixRouter().studio.videos.view(video?.id)}
                >
                  <Box
                    width={'55px'}
                    height={'30px'}
                    borderRadius={'3px'}
                    overflow="hidden"
                    marginRight={1}
                  >
                    <ImageCover ratio={16 / 9} src={video.thumbnail} />
                  </Box>

                  <Stack direction="column" spacing={0}>
                    <Typography variant="body1" display="flex" lineHeight={1}>
                      {video.title}
                      <Typography sx={{ fontSize: '0.8em', marginLeft: 1 }}>
                        {t('common.informations.publish')}{' '}
                        {video.publisher?.firstName} {video.publisher?.lastName}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="caption"
                      display="flex"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      {`${abbreviateNumber(video?.views || 0)} ${t<string>(
                        'slug.details.tooltips.views',
                        { ns: 'videos' }
                      )}${video?.views && video?.views > 1 ? 's' : ''}`}
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        sx={{ height: '0.6em' }}
                        flexItem
                      />
                      {
                        t('slug.details.tooltips.likes', {
                          ns: 'videos',
                          count: abbreviateNumber(
                            video?.likes || 0
                          ) as unknown as number,
                        }) as string
                      }
                    </Typography>
                  </Stack>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <PopOver>
          <List>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyflixRouter().studio.videos.view(outputData?.id)}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyflixRouter().studio.videos.update(outputData?.id)}
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
      <Header title={t('videos.title')} description={t('videos.description')} />
      {content()}
      <TablePagination
        component="div"
        count={data?.totalCount || 0}
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
