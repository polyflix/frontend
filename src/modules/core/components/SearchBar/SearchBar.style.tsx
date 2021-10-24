import { styled } from '@mui/material'
import TextField from '@mui/material/TextField'

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
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

export const boxStyles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 350, md: 550 },
  bgcolor: 'background.default',
  borderRadius: 2,
  boxShadow: 10,
  p: 4,
}
