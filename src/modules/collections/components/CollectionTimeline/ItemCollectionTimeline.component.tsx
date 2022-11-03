import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Alert, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { useQuery } from '@core/hooks/useQuery'
import { Element } from '@core/models/element.model'
import { ElementType } from '@core/types/element.type'
import { Role } from '@core/types/roles.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

type ItemCollectionTimelineProps = {
  index: number
  isLast: boolean
  element: Element<any>
  collectionSlug: string
}

export const ItemCollectionTimeline = ({
  index,
  isLast,
  element,
  collectionSlug,
}: ItemCollectionTimelineProps) => {
  const { t } = useTranslation('collections')
  const [isHover, setIsHover] = useState(false)

  const query = useQuery() as URLSearchParams
  const { user } = useAuth()
  const isAdmin = user?.roles?.length && user?.roles?.includes(Role.Admin)

  const handleMouseEnter = () => {
    console.log('enter')
    setIsHover(true)
  }

  const handleMouseLeave = () => {
    console.log('exit')
    setIsHover(false)
  }
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

  const generateLinkAttribute = () => {
    // Peut etre le faire dans le return avec if type
    switch (element.type) {
      case 'link':
        return {
          to: element.data.url as string,
          // target: '_blank',
          // component: 'a',
        }
      case 'quizz':
        return {
          to: `/quizzes/${element.id}/play`,
          // target: '_blank',
          // component: 'a',
        }
      case 'video':
        return {
          to: `/videos/${element.slug}?c=${collectionSlug}&index=${index}`,
          // target: '_self',
          // component: RouterLink,
        }
    }
  }
  return (
    <RouterLink
      key={index}
      {...generateLinkAttribute()}
      style={{ textDecoration: 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TimelineItem
        sx={{
          '&::before': {
            content: 'none',
          },
        }}
      >
        <TimelineSeparator>
          <TimelineDot
            color={+query.get('index')! === index ? 'primary' : 'grey'}
          >
            <Icon name={elementIcon(element.type)} />
          </TimelineDot>
          {isLast && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          {element.visibility === 'private' &&
          element?.id != element.user?.id &&
          !isAdmin ? (
            <Alert severity="error">{t('visibility.private')}</Alert>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: isHover ? 'underline' : 'none',
                  color: 'black',
                }}
              >
                {element.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'capitalize',
                  color: 'black',
                }}
              >
                {element.type}
              </Typography>
            </>
          )}
        </TimelineContent>
      </TimelineItem>
    </RouterLink>
  )
}
