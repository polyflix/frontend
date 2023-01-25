import { Icon } from '@core/components/Icon/Icon.component'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { QuickAccessCard } from './quick-access-card.component'

export interface QuickLink {
  title: string
  description: string
  icon: string
  to: string
  active?: boolean
}
type QuickAccesstProps = {
  quickLinks: QuickLink[]
}
export const QuickAccess = ({ quickLinks }: QuickAccesstProps) => {
  const { t } = useTranslation('studio')

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={1} alignItems="center">
        <Icon name="eva:flash-fill" />
        <Typography variant="h6" color="initial">
          {t('home.quickAccess.title')}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 2,
        }}
      >
        {quickLinks.map((element: QuickLink, i: number) => (
          <QuickAccessCard key={i} quickLinks={element} />
        ))}
      </Box>
    </Stack>
  )
}
