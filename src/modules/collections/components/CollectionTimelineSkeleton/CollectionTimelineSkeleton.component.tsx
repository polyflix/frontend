import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Skeleton } from '@mui/material'
import React from 'react'

export const CollectionTimelineSkeleton: React.FC = () => {
  return (
    <Timeline position="right">
      {[...new Array(2)].map((_, i: number) => (
        <TimelineItem
          key={i}
          sx={{
            '&::before': {
              content: 'none',
            },
          }}
        >
          <TimelineSeparator>
            <Skeleton variant="circular" width="40px" height="40px" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Skeleton variant="text" width="65%" />
            <Skeleton variant="text" width="25%" />
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
