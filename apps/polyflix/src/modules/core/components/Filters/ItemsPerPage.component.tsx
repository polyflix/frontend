import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useState } from 'react'

type Props = {
  onChange: (value: number) => void
}

const options = [10, 30, 50, 100]

export const ItemsPerPage = ({ onChange }: Props) => {
  const [selected, setSelected] = useState<number>(options[0])

  return (
    <ToggleButtonGroup
      size="small"
      value={selected}
      exclusive
      onChange={(e, value) => {
        if (value !== null) {
          setSelected(value)
          onChange(value)
        }
      }}
      aria-label="items per page"
    >
      {options.map((value) => (
        <ToggleButton key={value} value={value}>
          {value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
