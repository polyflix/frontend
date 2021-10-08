import {
  SortAscendingIcon,
  SortDescendingIcon,
  ViewListIcon,
} from '@heroicons/react/outline'
import { QuerySort, QuerySortOperator } from '@nestjsx/crud-request'
import { useState } from 'react'

import { cn, WithClassname } from '../../../common'

type Props = WithClassname & {
  property: string
  label: string
  onSort: (sort: QuerySort) => void
}

const buildSort = (
  property: string,
  operator: QuerySortOperator
): QuerySort => ({
  field: property,
  order: operator,
})

export const SortBy = ({ label, property, onSort, className = '' }: Props) => {
  const [operator, setOperator] = useState<QuerySortOperator | undefined>()

  const handleSort = () => {
    let next: QuerySortOperator | undefined

    if (!operator) next = 'ASC'
    else if (operator === 'ASC') next = 'DESC'
    else next = undefined

    setOperator(next)
    onSort(buildSort(property, next!))
  }

  const Icon = !operator
    ? ViewListIcon
    : operator === 'ASC'
    ? SortAscendingIcon
    : SortDescendingIcon

  return (
    <button
      onClick={handleSort}
      className={cn(
        className,
        'flex text-nx-white h-12 border-3 border-darkgray rounded-md items-center hover:bg-darkgray transition-all outline-none focus:outline-none'
      )}
    >
      <span className="min-w-pagination h-full p-2 bg-darkgray flex items-center justify-center">
        <Icon className={cn('w-5', !!operator && 'text-nx-red')} />
      </span>
      <span className="py-2 px-4">{label}</span>
    </button>
  )
}
