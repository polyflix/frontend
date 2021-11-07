import { PlayArrow } from '@mui/icons-material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Alert, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Page } from '@core/components/Page/Page.component'
import { ElementType } from '@core/types/element.type'

import { useGetCollectionQuery } from '@collections/services/collection.service'

export const CollectionSlugPage = () => {
  const { t } = useTranslation('collections')
  const { slug } = useParams<{ slug: string }>()

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
      case 'quizze':
        return 'healthicons:i-exam-multiple-choice'
    }
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
    </Page>
  )
}
