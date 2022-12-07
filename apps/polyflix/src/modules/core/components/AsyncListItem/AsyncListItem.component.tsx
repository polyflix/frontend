import { ListItemText } from '@mui/material'

import { AsyncText } from '../AsyncText/AsyncListItem.component'

type AsyncListItemTextProps = {
  primary: string | number | undefined
  secondary: string | number | undefined
}

export const AsyncListItemText = ({
  primary,
  secondary,
}: AsyncListItemTextProps) => {
  return (
    <ListItemText
      primary={<AsyncText value={primary} />}
      secondary={<AsyncText value={secondary} />}
    />
  )
}
