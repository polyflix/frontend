import React, { PropsWithChildren } from "react";
import { WithClassname } from "../../types/props.type";
import { cn } from "../../utils/classes.util";

type Props = WithClassname & {
  /** If set to true, the content will be centered. Default to false */
  mxAuto?: boolean;
  /** If set to true, the container will take full width */
  fluid?: boolean;
};

/**
 * Component which create a container.
 */
const Container: React.FC<PropsWithChildren<Props>> = ({
  children,
  mxAuto = false,
  className = "",
  fluid,
}) => {
  return (
    <div
      className={cn(fluid ? "" : "container", mxAuto && "mx-auto", className)}
    >
      {children}
    </div>
  );
};

export default Container;
