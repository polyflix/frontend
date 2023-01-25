import { Stack, CircularProgress } from '@mui/material'

export const LoadingFallback = () => {
  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <CircularProgress variant="indeterminate" />
    </Stack>
  )
}
