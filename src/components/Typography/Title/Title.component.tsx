import { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../../types/props.type";
import { cn } from "../../../utils/classes.util";
import Typography from "../Typography.component";

type Props = WithClassname & WithMotion;

const Title: React.FC<PropsWithChildren<Props>> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <Typography
      {...rest}
      as="h1"
      className={cn(className, "font-black text-2xl md:text-3xl")}
    >
      {children}
    </Typography>
  );
};

export default Title;
