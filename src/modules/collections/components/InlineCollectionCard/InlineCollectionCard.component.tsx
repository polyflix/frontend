import { Stack, Typography } from '@mui/material'
import React from 'react'

import { Collection } from '@collections/models/collection.model'

type Props = {
  collection: Collection
}

export const InlineCollectionCard: React.FC<Props> = ({ collection }) => {
  const DESCRIPTION_LENGTH = 50

  return (
    <Stack
      sx={{
        my: 1,
        pb: 1,
        px: 2,
        borderBottom: 1,
        borderColor: 'grey.300',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'bg',
        },
      }}
    >
      <Typography variant="h6">{collection.name}</Typography>
      <Typography variant="body1">
        {collection.description.length > DESCRIPTION_LENGTH
          ? `${collection.description.substring(0, DESCRIPTION_LENGTH - 3)}...`
          : collection.description}
      </Typography>
    </Stack>
  )
}
