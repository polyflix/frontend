import { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../../../common/types/props.type";
import { cn } from "../../../../common/utils/classes.util";
import { Typography } from "../Typography.component";

type Props = WithClassname & WithMotion;

export const Paragraph: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <Typography
      {...rest}
      className={cn(className, "font-light leading-6 text-sm md:text-base")}
      as="p"
    >
      {children}
    </Typography>
  );
};
