import React, { FC } from "react";
import { WithClassname } from "../types";
import { cn } from "../utils";
import { Arrow, ArrowKind } from "./Navigation/Arrow";

type ShortCardProps = WithClassname &
  ArrowKind & {
    onClick: () => void;
  };

const ShortCard: FC<ShortCardProps> = ({
  onClick,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div
      className={cn("border-nx-red border-3 rounded-lg p-4 flex", className)}
    >
      <span className="w-11/12">{children}</span>

      <Arrow {...rest} />
    </div>
  );
};

export { ShortCard };
