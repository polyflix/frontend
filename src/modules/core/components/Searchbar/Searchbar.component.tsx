// import { InputBase } from '@mui/material'

// import { SearchbarRootStyle } from './Searchbar.style'

interface Props {
  label?: string
  onChange: (value: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Searchbar = ({ label, onChange }: Props) => {
  return (
    <></>
    // <SearchbarRootStyle>
    //   <InputBase
    //     onChange={({ target }) => onChange(target.value)}
    //     placeholder={label}
    //   />
    // </SearchbarRootStyle>
  )
}
