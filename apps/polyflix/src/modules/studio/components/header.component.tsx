import { Button, Divider, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'

type HeaderProps = {
  title: string
  description: string
}

export const Header = ({ title, description }: HeaderProps) => {
  const { url } = useRouteMatch()

  return (
    <Stack direction="column">
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <Typography variant="h3" color="initial">
          {title}
        </Typography>
        <Button component={RouterLink} to={`${url}/create`} variant="contained">
          Create
        </Button>
      </Stack>
      <Typography
        variant="body2"
        color="initial"
        sx={{
          pb: 1,
        }}
      >
        {description}
      </Typography>
      <Divider />
    </Stack>
  )
}
