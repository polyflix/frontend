import { Icon } from '@core/components/Icon/Icon.component'
import { Box, Stack, Typography } from '@mui/material'
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
  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={1} alignItems="center">
        <Icon name="eva:flash-fill" />
        <Typography variant="h6" color="initial">
          Quick access
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
