import { Stack, Typography } from '@mui/material'

interface Props {
  title?: string
  description?: string
  actionButton?: React.ReactNode
  hideActionButton?: boolean
}

// A simple component to display a page header
export const Header = ({
  description,
  title,
  actionButton,
  hideActionButton = false,
}: Props) => {
  return (
    <Stack
      spacing={1}
      sx={{
        mb: 3,
      }}
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      alignItems={{
        xs: 'stretch',
        sm: 'start',
      }}
      justifyContent="space-between"
    >
      <Stack spacing={1} sx={{ mb: 3 }} direction="column">
        <Typography variant="h3">{title}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Stack>
      {!!actionButton && !hideActionButton && (
        <Stack sx={{ whiteSpace: 'nowrap' }}>{actionButton}</Stack>
      )}
    </Stack>
  )
}
