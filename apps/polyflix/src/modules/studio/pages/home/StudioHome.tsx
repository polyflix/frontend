import { polyflixRouter } from '@core/utils/routes'
import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { QuickAccess, QuickLink } from '../../components/quick-link.component'

export const StudioHome = () => {
  const quickLinks: QuickLink[] = [
    {
      title: 'home.quickAccess.cards.video.title',
      description: 'home.quickAccess.cards.video.description',
      icon: 'eva:film-outline',
      to: polyflixRouter().studio.videos.create,
    },
    {
      title: 'home.quickAccess.cards.quizz.title',
      description: 'home.quickAccess.cards.quizz.description',
      icon: 'healthicons:i-exam-multiple-choice',
      to: polyflixRouter().studio.quizzes.create,
    },
    {
      title: 'home.quickAccess.cards.cours.title',
      description: 'home.quickAccess.cards.cours.description',
      icon: 'gg:align-left',
      to: polyflixRouter().studio.courses.create,
    },
  ]

  const { t } = useTranslation('studio')

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
        <Typography variant="h2" color="inherit">
          {t('home.title')}
        </Typography>
        <Typography variant="subtitle1" color="inherit">
          {t('home.description')}
        </Typography>
      </header>
      <QuickAccess quickLinks={quickLinks} />
    </Stack>
  )
}
