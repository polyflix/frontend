import { Skeleton, Typography, TypographyProps } from '@mui/material'
import { isNull, isString, isUndefined } from 'lodash'

type AsyncTextProps = {
  value: string | number | undefined
} & TypographyProps

export const AsyncText: React.FC<AsyncTextProps> = ({
  value,
  ...props
}: AsyncTextProps) => {
  return (
    <>
      {isNull(value) ||
      isUndefined(value) ||
      (isString(value) && value.length === 0) ? (
        <Skeleton animation="wave" width="100%" />
      ) : (
        <Typography {...props}>{value}</Typography>
      )}
    </>
  )
}
