import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import { WithClassname, WithMotion } from '../../../common/types/props.type'
import { cn } from '../../../common/utils/classes.util'

type Props = WithClassname &
  WithMotion & {
    /** The name of the HTML input */
    name: string
    /** The hint to display below the field */
    hint?: string
    /** The ref for the component */
    ref: any
    /** If true, the field will be required */
    required?: boolean
    /** If true, the field will be disabled */
    disabled?: boolean
    /** The list to display for the select */
    options?: string[]
    /** The id of the linked form */
    form?: string
  }

/**
 * A simple HTML input component compatible with the react-hook-form API.
 */
export const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      className = '',
      name,
      disabled = false,
      required = false,
      hint,
      options = [],
      form = '',
      ...rest
    },
    forwardedRef
  ) => (
    <motion.div {...rest} className={cn('flex flex-col', className)}>
      <select
        name={name}
        className="border dark:bg-nx-white focus:outline-none py-3 px-5 rounded-md font-display"
        disabled={disabled}
        required={required}
        ref={forwardedRef}
        form={form}
      >
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hint && <small className="text-gray-400">{hint}</small>}
    </motion.div>
  )
)
