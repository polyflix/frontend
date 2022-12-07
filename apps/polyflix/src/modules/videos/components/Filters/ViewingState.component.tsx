import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  onChange: Function
}

export interface VisibilityOption {
  value: string
  label: string
}

export const ViewingState = ({ onChange }: Props) => {
  const { t } = useTranslation('videos')
  const options = [
    { value: 'all', label: t('filter.all') },
    { value: 'watched', label: t('filter.watched') },
    { value: 'watching', label: t('filter.watching') },
  ]
  const [selected, setSelected] = useState<VisibilityOption>(options[0])

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
      {options.map((opt) => (
        <ToggleButton key={opt.value} value={opt.value}>
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
