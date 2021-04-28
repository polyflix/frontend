import { PropsWithChildren } from "react";
import { cn } from "../../../utils/classes.util";
import Button, { ButtonProps } from "../Button.component";

const FilledButton: React.FC<PropsWithChildren<ButtonProps>> = ({
  as,
  children,
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <Button
      disabled={disabled}
      className={cn(
        className,
        disabled
          ? "bg-nx-dark bg-opacity-40 cursor-not-allowed"
          : "bg-nx-red transition-colors hover:bg-nx-red-dark",
        "text-white"
      )}
      {...rest}
      as={as}
    >
      {children}
    </Button>
  );
};

export default FilledButton;
