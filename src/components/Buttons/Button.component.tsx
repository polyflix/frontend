import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../types/props.type";
import { cn } from "../../utils/classes.util";

export type ButtonProps = WithClassname &
  WithMotion & {
    as: "button" | "input";
    inputValue?: string;
    disabled?: boolean;
    onClick?: (
      e: React.MouseEvent<HTMLButtonElement | HTMLInputElement, MouseEvent>
    ) => void;
  };

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  as,
  children,
  inputValue = "",
  className = "",
  disabled = false,
  ...rest
}) => {
  const As = motion[as];
  const classes = cn(
    className,
    "cursor-pointer py-3 px-4 rounded-md font-bold focus:outline-none"
  );
  if (as === "input") {
    return (
      <As
        {...rest}
        disabled={disabled}
        className={classes}
        type="submit"
        value={inputValue}
      ></As>
    );
  } else {
    return (
      <As {...rest} disabled={disabled} className={classes}>
        {children}
      </As>
    );
  }
};

export default Button;
