import { ListItemText, ListItem, styled } from '@mui/material'

export const ListItemStyle = styled(ListItem)<any>(() => ({
  padding: 0,
}))

export const ListItemTextStyle = styled(ListItemText)<any>(
  ({ theme, current }) => ({
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    margin: 0,
    paddingRight: theme.spacing(1),
    '&:hover, &:hover .MuiListItemText-secondary': {
      color: theme.palette.primary.main,
    },
    '.MuiListItemText-secondary': {
      marginRight: theme.spacing(2),
      width: '58px',
    },
    ...(current === 'true' && {
      borderLeft: '2px solid',
      borderColor: theme.palette.primary.main,
      paddingLeft: theme.spacing(1),
      backgroundColor: theme.palette.grey[200],
    }),
    ...(current === 'false' && {
      marginLeft: `calc(${theme.spacing(1)} + 2px)`,
    }),
  })
)
