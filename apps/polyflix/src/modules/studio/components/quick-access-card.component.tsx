import { Icon } from '@core/components/Icon/Icon.component'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { QuickLink } from './quick-link.component'

type QuickAccessCardProps = {
  quickLinks: QuickLink
}
export const QuickAccessCard = ({ quickLinks }: QuickAccessCardProps) => {
  return (
    <Button
      component={RouterLink}
      variant="outlined"
      color="inherit"
      sx={{
        p: 0,
        m: 0,
        textDecoration: 'none',
        width: '100%',
        height: '100%',
        border: 'none',
      }}
      to={quickLinks.to}
    >
      <Paper
        sx={{
          p: 3,
          width: '100%',
          height: '100%',
          color: 'text.primary',
          '&:hover, &:focus': {
            borderColor: 'primary.main',
          },
        }}
        variant="outlined"
        component={Stack}
        direction="column"
        gap={1}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Icon name={quickLinks.icon} />
          <Typography variant="h5">{quickLinks.title}</Typography>
        </Stack>
        <Typography variant="body1">{quickLinks.description}</Typography>
      </Paper>
    </Button>
  )
}
