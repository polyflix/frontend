import { Avatar, Box, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { DraftTag } from '@core/components/Chip/Draft.component'
import { VisibilityIcons } from '@core/components/Visibility/Icons/VisibilityIcons.component'
import { clampString } from '@core/utils/text.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import {
  CardFooterStyle,
  RootStyle,
} from '@collections/components/CollectionCard/CollectionCard.style'

import { Course } from '@types_/resources/course.type'
import { useDeleteCourseMutation } from '@courses/services/course.service'
import { polyflixRouter } from '@routes/index'

interface Props {
  course: Course
}

export const CourseCard = ({ course }: Props) => {
  const { t } = useTranslation('courses')
  const { user } = useAuth()

  const [deleteCourse] = useDeleteCourseMutation()
  const handleDelete = () => {
    deleteCourse({ slug: course.slug })
  }

  return (
    <RootStyle
      variant="outlined"
      sx={{ flexShrink: 0, flexGrow: 0, height: '280px' }}
    >
      {/** The thing with collection.draft is meant to be here because DOM cannot parse it if it's not a string **/}
      <Link
        component={RouterLink}
        to={`/courses/${course.slug}`}
        underline="none"
        color="inherit"
        sx={{ height: '100%' }}
      >
        {course.draft && (
          <DraftTag
            size="small"
            variant="outlined"
            label={t('courseCard.tags.draft')}
          />
        )}
        <Stack spacing={2} direction="row" sx={{ p: 2, maxHeight: '125px' }}>
          <Box sx={{ pt: 1 }}>
            <Avatar
              sx={{ width: 32, height: 32 }}
              variant="circular"
              src={course.user?.avatar}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              <VisibilityIcons visibility={course!.visibility!} />
              {course.name}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {clampString(course.description, 110)}
            </Typography>
          </Box>
        </Stack>
      </Link>
      <CardFooterStyle className="card-footer">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <Typography variant="body2">
            {t('courseCard.footerElements', {
              count: course?.modules?.length || 0,
            })}
          </Typography>
          {course?.user?.id === user?.id && (
            <CardMenu
              updateHref={polyflixRouter().studio.courses.update(course.slug)}
              onDelete={handleDelete}
              type="courses"
            />
          )}
        </Stack>
      </CardFooterStyle>
    </RootStyle>
  )
}
