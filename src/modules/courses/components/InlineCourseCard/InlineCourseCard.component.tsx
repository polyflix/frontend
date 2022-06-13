import { Stack, Typography } from '@mui/material'
import React from 'react'

import { Course } from '@courses/models/course.model'

type Props = {
  course: Course
}

export const InlineCourseCard: React.FC<Props> = ({ course }) => {
  const DESCRIPTION_LENGTH = 50

  return (
    <Stack
      sx={{
        my: 1,
        pb: 1,
        px: 2,
        borderBottom: 1,
        borderColor: 'grey.300',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'bg',
        },
      }}
    >
      <Typography variant="h6">{course.name}</Typography>
      <Typography variant="body1">
        {course.description.length > DESCRIPTION_LENGTH
          ? `${course.description.substring(0, DESCRIPTION_LENGTH - 3)}...`
          : course.description}
      </Typography>
    </Stack>
  )
}
