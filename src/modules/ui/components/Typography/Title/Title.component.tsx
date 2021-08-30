import { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../../../common/types/props.type";
import { cn } from "../../../../common/utils/classes.util";
import { Typography } from "../Typography.component";

type Props = WithClassname & WithMotion & { overrideDefaultClasses?: boolean };

export const Title: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = "",
  overrideDefaultClasses = false,
  ...rest
}) => {
  return (
    <Typography
      {...rest}
      as="h1"
      overrideDefaultClasses={overrideDefaultClasses}
      className={cn(
        className,
        !overrideDefaultClasses && "font-black text-xl md:text-2xl lg:text-3xl"
      )}
    >
      {children}
    </Typography>
  );
};
