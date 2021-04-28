import { motion } from "framer-motion";
import { forwardRef, PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";
import fadeInDown from "../../../animations/fadeInDown";
import { WithClassname, WithMotion } from "../../../types/props.type";
import { cn } from "../../../utils/classes.util";

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
  };

/**
 * A custom checkbox compatible with react-hook-form API.
 */
const Checkbox = forwardRef<HTMLInputElement, PropsWithChildren<Props>>(
  ({ className = "", name, error, children, icon, ...rest }, forwardRef) => (
    <motion.div
      {...rest}
      className={cn(className, "relative", icon && "flex items-center")}
      variants={fadeInDown}
    >
      {icon}
      <input
        className={cn("mr-2", icon && "opacity-0 absolute")}
        id={name}
        ref={forwardRef}
        type="checkbox"
        name={name}
      ></input>
      <label
        className="cursor-pointer transition-all hover:underline"
        htmlFor={name}
      >
        {children}
      </label>
    </motion.div>
  )
);

export default Checkbox;
