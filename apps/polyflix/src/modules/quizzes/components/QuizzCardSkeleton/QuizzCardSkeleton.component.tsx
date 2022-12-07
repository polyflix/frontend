import { Card, Skeleton } from '@mui/material'

export const QuizzCardSkeleton = () => {
  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
        overflow: 'visible',
        width: '100%',
        height: '100%',
      }}
      variant="outlined"
    >
      <Skeleton variant="text" width="100%" />
    </Card>
  )
}
