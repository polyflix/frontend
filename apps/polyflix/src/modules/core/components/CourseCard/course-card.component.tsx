import { useAuth } from '@auth/hooks/useAuth.hook'
import { Course } from '@courses/models/course.model'
import {
  Avatar,
  Box,
  Link,
  Paper,
  Skeleton,
  styled,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'
import { Link as RouterLink } from 'react-router-dom'
import { Stack } from '@mui/system'
import { ElementSmallTag } from '../ElementSmallTag/element-small-tag.component'
import { ElementLockIcon } from '../ElementLockIcon/element-lock-icon.component'
import { VisibilityIcons } from '../Visibility/Icons/VisibilityIcons.component'
import { clampString } from '@core/utils/text.utils'
import { CardMenu } from '../CardMenu/CardMenu.component'
import { polyflixRouter } from '@core/utils/routes'

export const CourseCardRootStyled = styled<any>(Paper)(() => ({
  position: 'relative',
  height: '200px',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}))

export const CardFooterStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(0, 0, 1, 1),
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.bg,
}))

type CourseCardProps = {
  course?: Course | undefined
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const { t } = useTranslation('courses')
  const handleDelete = () => {}
  const { user } = useAuth()

  if (!course) {
    return (
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <AspectRatioBox ratio={16 / 9} sx={{ width: '100%', height: '100%' }}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </AspectRatioBox>
      </Paper>
    )
  }

  return (
    <CourseCardRootStyled
      variant="outlined"
      sx={{ flexShrink: 0, flexGrow: 0, height: '280px' }}
    >
      <Link
        component={RouterLink}
        to={`/courses/${course.slug}`}
        underline="none"
        color="inherit"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pt: 2,
            px: 2,
          }}
        >
          <Avatar
            sx={{ width: 32, height: 32, opacity: course.draft ? 0.4 : 1 }}
            variant="circular"
            src={course.user?.avatar}
          />
          <Stack direction="row" sx={{ p: 1 }} alignItems="center" spacing={1}>
            {course.draft && <ElementSmallTag text="Draft" />}
            {course.visibility === 'private' && <ElementLockIcon />}
          </Stack>
        </Stack>
        <Box
          sx={{
            px: 2,
            opacity: course.draft ? 0.4 : 1,
          }}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            <VisibilityIcons visibility={course!.visibility!} />
            {course.name}
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {clampString(course.description, 110)}
          </Typography>
        </Box>
      </Link>
      <CardFooterStyle>
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
              publisherId={course.user?.id}
              type="courses"
            />
          )}
        </Stack>
      </CardFooterStyle>
    </CourseCardRootStyled>
  )
}
