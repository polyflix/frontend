import { PropsWithChildren } from "react";
import { cn } from "../../../../common/utils/classes.util";
import { Button, ButtonProps } from "../Button.component";

export const FilledButton: React.FC<PropsWithChildren<ButtonProps>> = ({
  as,
  children,
  className = "",
  disabled = false,
  form = "",
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
        "text-white",
        "border-2 border-nx-red hover:border-nx-red-dark"
      )}
      {...rest}
      as={as}
      form={form}
    >
      {children}
    </Button>
  );
};
