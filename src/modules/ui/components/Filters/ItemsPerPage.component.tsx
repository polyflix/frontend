import { useState } from 'react'

import { cn } from '../../../common'

type Props = {
  onChange: (value: number) => void
}

const options = [10, 30, 50, 100]

export const ItemsPerPage = ({ onChange }: Props) => {
  const [selected, setSelected] = useState<number>(options[0])

  return (
    <div className="border-3 border-darkgray flex items-center h-12 rounded-md">
      {options.map((value, idx) => {
        const isActive = selected === value
        const isSeparated = idx !== 0
        return (
          <button
            key={value}
            onClick={() => {
              setSelected(value)
              onChange(value)
            }}
            className={cn(
              'text-nx-white min-w-pagination flex items-center h-full justify-center focus:outline-none outline-none',
              isActive && 'bg-darkgray',
              isSeparated && 'border-l-3 border-darkgray'
            )}
          >
            {value}
          </button>
        )
      })}
    </div>
  )
}
