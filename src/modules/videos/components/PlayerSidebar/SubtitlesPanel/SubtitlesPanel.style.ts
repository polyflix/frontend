import { styled, Typography } from '@mui/material'

export const SubtitleSentence = styled(Typography)<any>(
  ({ theme, current }) => ({
    cursor: 'pointer',
    display: 'inline-flex',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    margin: 0,
    paddingRight: theme.spacing(1),
    '&:hover': {
      color: theme.palette.primary.main,
    },
    ...(current === 'true' && {
      textDecoration: 'underline',
    }),
  })
)
