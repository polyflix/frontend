import { PropsWithChildren } from "react";
import { cn } from "../../../../common/utils/classes.util";
import { Button, ButtonProps } from "../Button.component";

export const OutlineButton: React.FC<PropsWithChildren<ButtonProps>> = ({
  as,
  children,
  className = "",
  ...rest
}) => {
  return (
    <Button
      className={cn(
        className,
        "border-2 border-nx-red text-nx-red bg-transparent transition-colors hover:bg-nx-red hover:text-white"
      )}
      {...rest}
      as={as}
    >
      {children}
    </Button>
  );
};
