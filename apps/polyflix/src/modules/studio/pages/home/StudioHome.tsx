import { polyfilxRouter } from '@core/utils/routes'
import { Stack, Typography } from '@mui/material'
import { QuickAccess, QuickLink } from '../../components/quick-link.component'

export const StudioHome = () => {
  const quickLinks: QuickLink[] = [
    {
      title: 'Video',
      description: 'Create a video',
      icon: 'eva:film-outline',
      to: polyfilxRouter().studio.videos.create,
    },
    {
      title: 'Quizz',
      description: 'Create a quizz',
      icon: 'healthicons:i-exam-multiple-choice',
      to: polyfilxRouter().studio.quizzes.create,
    },
    {
      title: 'Cours',
      description: 'Create a cours',
      icon: 'gg:align-left',
      to: polyfilxRouter().studio.courses.create,
    },
  ]

  return (
    <Stack
      component="section"
      gap={8}
      direction="column"
      sx={{
        px: 2,
        width: '100%',
      }}
    >
      <header>
        <Typography variant="h2" color="initial">
          Welcome to Studio 👋
        </Typography>
        <Typography variant="subtitle1" color="initial">
          Here you can edit, create and list all Polyflix&apos;s elements
        </Typography>
      </header>
      <QuickAccess quickLinks={quickLinks} />
    </Stack>
  )
}
