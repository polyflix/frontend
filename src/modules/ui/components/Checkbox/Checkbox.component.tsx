import { motion } from "framer-motion";
import { forwardRef, PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";
import { WithClassname, WithMotion } from "../../../common/types/props.type";
import { cn } from "../../../common/utils/classes.util";

type Props = WithClassname &
  WithMotion & {
    /** The name of the input */
    name: string;
    /** The ref of the component */
    ref: any;
    /** The error for the field */
    error?: FieldError;
    /** The icon for the checkbox */
    icon?: any;
    checked?: boolean;
    /** The form id */
    form?: string;
  };

/**
 * A custom checkbox compatible with react-hook-form API.
 */
export const Checkbox = forwardRef<HTMLInputElement, PropsWithChildren<Props>>(
  (
    {
      className = "",
      name,
      error,
      children,
      icon,
      checked,
      form = "",
      ...rest
    },
    forwardRef
  ) => (
    <motion.div
      {...rest}
      className={cn(className, "relative", icon && "flex items-center")}
    >
      {children ? icon : null}
      <input
        className={cn("mr-2", icon && "opacity-0 absolute")}
        id={name}
        ref={forwardRef}
        type="checkbox"
        checked={checked}
        name={name}
        form={form}
      />
      <label
        className="cursor-pointer transition-all hover:underline"
        htmlFor={name}
      >
        {children ? children : icon}
      </label>
    </motion.div>
  )
);
