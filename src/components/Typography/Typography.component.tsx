import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../types/props.type";
import { cn } from "../../utils/classes.util";

type Props = WithClassname &
  WithMotion & {
    /** The rendered HTML tag  */
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    /** If set to true, it default classes will be override */
    overrideDefaultClasses?: boolean;
    /** If true, the text will be displayed in bold */
    bold?: boolean;
  };

/**
 * A component to standardize the typography in the app.
 */
const Typography: React.FC<PropsWithChildren<Props>> = ({
  children,
  as = "p",
  overrideDefaultClasses = false,
  className = "",
  bold = false,
  ...rest
}) => {
  const Component = motion[as];
  return (
    <Component
      {...rest}
      className={cn(
        className,
        !overrideDefaultClasses && "dark:text-nx-white",
        bold && "font-bold"
      )}
    >
      {children}
    </Component>
  );
};

export default Typography;
