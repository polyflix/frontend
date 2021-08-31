import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { WithClassname, WithMotion } from '../../../common/types/props.type';
import { cn } from '../../../common/utils/classes.util';

type Props = WithClassname &
  WithMotion & {
    /** The name of the HTML input */
    name: string
    /** The type of the HTML input */
    type?: string
    /** The hint to display below the field */
    hint?: string
    /** The placeholder to display in the field */
    placeholder: string
    /** The ref of the component */
    ref: any
    /** The error for the field */
    error?: FieldError
    /** If true, the field will be required */
    required?: boolean
    /** If true, the field will be disabled */
    disabled?: boolean;
    /** onChange event for input tag */
    onChange?: () => void;
  };

/**
 * A simple HTML input component compatible with the react-hook-form API.
 */
export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      className = '',
      name,
      type = 'text',
      disabled = false,
      placeholder,
      required = false,
      error,
      hint,
      onChange,
      ...rest
    },
    forwardRef,
  ) => (
    <motion.div {...rest} className={cn('flex flex-col', className)}>
      <input
        onChange={onChange}
        name={name}
        type={type}
        disabled={disabled}
        className={cn(
          "border dark:bg-nx-white focus:outline-none py-2 px-5 rounded-md font-display",
          disabled && "dark:bg-nx-gray opacity-80"
        )}
        placeholder={`${placeholder} ${required ? "*" : ""}`}
        ref={forwardRef}
      />
      {!error && hint && <small className="text-gray-400 mt-2">{hint}</small>}
      {error && <small className="text-red-400">{error.message}</small>}
    </motion.div>
  ),
);
