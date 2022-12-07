import SearchIcon from '@mui/icons-material/Search'

import { Search, SearchIconWrapper, StyledInputBase } from './Searchbar.style'

interface Props {
  label?: string
  onChange: (value: string) => void
}

export const Searchbar = ({ label, onChange }: Props) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={label}
        onChange={({ target }) => onChange(target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  )
}
