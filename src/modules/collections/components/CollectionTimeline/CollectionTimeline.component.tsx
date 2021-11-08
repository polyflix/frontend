import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab'
import { Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { useQuery } from '@core/hooks/useQuery'
import { Element } from '@core/models/element.model'
import { ElementType } from '@core/types/element.type'

import { Collection } from '@collections/models/collection.model'

type CollectionTimelineProps = {
  collection: Collection
}

export const CollectionTimeline = ({ collection }: CollectionTimelineProps) => {
  const query = useQuery() as URLSearchParams

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

  const generateLinkAttribute = (element: Element<any>, index: number) => {
    switch (element.type) {
      case 'link':
        return {
          href: element.data.url as string,
          target: '_blank',
          component: 'a',
        }
      case 'quizz':
        return {
          href: `/videos/${element.slug}?c=${collection?.slug}&index=${index}`,
          target: '_blank',
          component: 'a',
        }
      case 'video':
        return {
          to: `/videos/${element.slug}?c=${collection?.slug}&index=${index}`,
          target: '_self',
          component: RouterLink,
        }
    }
  }

  return (
    <Timeline position="right">
      {collection?.elements?.map((item, i: number) => {
        return (
          <TimelineItem
            key={i}
            sx={{
              '&::before': {
                content: 'none',
              },
            }}
          >
            <TimelineSeparator>
              <TimelineDot
                color={+query.get('index')! === i ? 'primary' : 'grey'}
              >
                <Icon name={elementIcon(item.type)} />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Link
                color="inherit"
                underline="none"
                {...generateLinkAttribute(item, i)}
              >
                <Typography variant="body1">{item.name}</Typography>
                <Typography
                  variant="caption"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {item.type}
                </Typography>
              </Link>
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}
