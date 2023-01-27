import { Stack, Typography } from '@mui/material'
import { QuickAccess, QuickLink } from '../components/quick-link.component'

export const StudioHome = () => {
  const quickLinks: QuickLink[] = [
    {
      title: 'Video',
      description: 'Create, view, list videos',
      icon: 'eva:film-outline',
      to: '/studio/video',
    },
  ]

  return (
    <Stack
      component="section"
      gap={8}
      direction="column"
      sx={{
        pt: 2,
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
