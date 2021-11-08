import { Delete, Edit, PlayArrow } from '@mui/icons-material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import {
  Alert,
  Button,
  Fab,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useParams } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { FabActionContainer } from '@core/components/FabActionContainer/FabActionContainer.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { Page } from '@core/components/Page/Page.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { ElementType } from '@core/types/element.type'
import { CrudAction } from '@core/types/http.type'

import {
  useDeleteCollectionMutation,
  useGetCollectionQuery,
} from '@collections/services/collection.service'

export const CollectionSlugPage = () => {
  const { t } = useTranslation('collections')
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const [deleteCourse] = useDeleteCollectionMutation()

  const { data, isLoading } = useGetCollectionQuery({
    id: slug,
    filters: {
      join: [{ field: 'elements' }],
    },
  })

  const elementIcon = (type: ElementType): string => {
    switch (type) {
      case 'video':
        return 'eva:play-circle-outline'
      case 'link':
        return 'eva:link-2-fill'
      case 'quizz':
        return 'healthicons:i-exam-multiple-choice'
    }
  }

  const handleDelete = () => {
    deleteCourse({ slug: data!.slug })
    snackbarService.notify(CrudAction.DELETE, Endpoint.Collections)
    history.push('/users/profile/collections')
  }

  return (
    <Page isLoading={isLoading}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2, pb: 4 }}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography variant="h3">{data?.name}</Typography>
                <Typography variant="body1">{data?.description}</Typography>
              </Stack>
              <Button variant="outlined" startIcon={<PlayArrow />}>
                {t('slug.actions.play')}
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="h4">{t('slug.list.title')}</Typography>
              {data?.elements.length ? (
                <Timeline position="right">
                  {data?.elements?.map((item, i: number) => (
                    <TimelineItem
                      key={i}
                      sx={{
                        '&::before': {
                          content: 'none',
                        },
                      }}
                    >
                      <TimelineSeparator>
                        <TimelineDot>
                          <Icon name={elementIcon(item.type)} />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography
                          variant="caption"
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {item.type}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Alert severity="info">{t('slug.list.noData')}</Alert>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      {data && (
        <FabActionContainer>
          <Fab
            color="primary"
            aria-label="add"
            size="small"
            onClick={handleDelete}
          >
            <Delete />
          </Fab>
          <Fab
            color="secondary"
            aria-label="edit"
            size="medium"
            component={Link}
            to={`/collections/${data.slug}/update`}
          >
            <Edit />
          </Fab>
        </FabActionContainer>
      )}
    </Page>
  )
}
