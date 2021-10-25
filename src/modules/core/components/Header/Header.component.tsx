import { Stack, Typography } from '@mui/material'

interface Props {
  title?: string
  description?: string
}

// A simple component to display a page header
export const Header = ({ description, title }: Props) => {
  return (
    <Stack spacing={3} sx={{ mb: 3 }}>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Stack>
  )
}
