import { Link } from '@mui/material'
import TextField from '@mui/material/TextField'
import { alpha, styled } from '@mui/system'

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  bgcolor: 'background.paper',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[300], 0.5),
  },
  margin: theme.spacing(0, 0, 0, 0),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: 'auto',
  },
}))

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.grey[500],
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const SearchField = styled(TextField)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.grey[900],
  '& .MuiFilledInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
  '& fieldset': {
    border: 'none',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    outline: 0,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
    },
  },
}))

export const SearchFieldInModal = styled(TextField)(({ theme }) => ({
  color: theme.palette.grey[900],
  '& .MuiFilledInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
  '& fieldset': {
    border: 'none',
  },
  width: '100%',

  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    outline: 0,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}))

export const SearchCard = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[400], 0.7),
  },
}))

export const HighlightedSpan = styled('span')(({ theme }) => ({
  position: 'relative',
  fontWeight: 'bold',
  '&:after': {
    content: '""',
    background: alpha(theme.palette.primary.main, 0.2),
    position: 'absolute',
    width: '100%',
    height: '35%',
    bottom: 0,
    left: 0,
  },
}))
