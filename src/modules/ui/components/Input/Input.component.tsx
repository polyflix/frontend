import { motion } from "framer-motion";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { WithClassname, WithMotion } from "../../../common/types/props.type";
import { cn } from "../../../common/utils/classes.util";

type Props = WithClassname &
  WithMotion & {
    /** The name of the HTML input */
    name: string;
    /** The type of the HTML input */
    type?: string;
    /** The hint to display below the field */
    hint?: string;
    /** The placeholder to display in the field */
    placeholder: string;
    /** The ref of the component */
    ref: any;
    /** The error for the field */
    error?: FieldError;
    /** If true, the field will be required */
    required?: boolean;
    /** If true, the field will be disabled */
    disabled?: boolean;
  };

/**
 * A simple HTML input component compatible with the react-hook-form API.
 */
export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      className = "",
      name,
      type = "text",
      disabled = false,
      placeholder,
      required = false,
      error,
      hint,
      ...rest
    },
    forwardRef
  ) => (
    <motion.div {...rest} className={cn("flex flex-col", className)}>
      <input
        name={name}
        type={type}
        disabled={disabled}
        className="border dark:bg-nx-white focus:outline-none py-3 px-5 rounded-md font-display"
        placeholder={`${placeholder} ${required ? "*" : ""}`}
        ref={forwardRef}
      />
      {!error && hint && <small className="text-gray-400">{hint}</small>}
      {error && <small className="text-red-400">{error.message}</small>}
    </motion.div>
  )
);
