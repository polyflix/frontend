import { motion } from "framer-motion";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { WithClassname, WithMotion } from "../../../types/props.type";
import { cn } from "../../../utils/classes.util";

type Props = WithClassname &
  WithMotion & {
    /** The name for the html textarea */
    name: string;
    /** The min height */
    minHeight?: number;
    /** The hint to display below the text area */
    hint?: string;
    /** The placeholder to display in the textarea */
    placeholder: string;
    /** The ref for the component */
    ref: any;
    /** The error for the field */
    error?: FieldError;
    /** If true, the field will be required */
    required?: boolean;
    /** If true, the field will be disabled */
    disabled?: boolean;
  };

/**
 * A simple TextArea component compatible with the react-hook-form API
 */
const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      className = "",
      minHeight,
      name,
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
      <textarea
        style={minHeight ? { minHeight: `${minHeight}px` } : {}}
        name={name}
        disabled={disabled}
        className="border resize-none dark:bg-nx-white focus:outline-none py-3 px-5 rounded-md font-display"
        placeholder={`${placeholder} ${required ? "*" : ""}`}
        ref={forwardRef}
      ></textarea>
      {!error && hint && <small className="text-gray-400">{hint}</small>}
      {error && <small className="text-red-400">{error.message}</small>}
    </motion.div>
  )
);

export default Textarea;
