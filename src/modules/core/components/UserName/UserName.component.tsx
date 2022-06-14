import { Stack, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import { capitalize } from 'lodash'

import { AsyncText } from '../AsyncText/AsyncListItem.component'

type UserNameProps = {
  firstName: string | undefined
  lastName: string | undefined
  variant?: Variant
}

export const UserName = ({
  firstName,
  lastName,
  variant = 'body1',
}: UserNameProps) => {
  return (
    <Typography variant={variant}>
      <Stack
        direction="row"
        component="span"
        spacing={1}
        sx={{
          width: '150px',
        }}
      >
        <AsyncText value={capitalize(firstName)} />
        <AsyncText value={capitalize(lastName)} />
      </Stack>
    </Typography>
  )
}
