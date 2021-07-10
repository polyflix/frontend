import React, { FC } from "react";
import { WithClassname } from "../types";
import { cn } from "../utils";
import { Arrow, ArrowKind } from "./Navigation/Arrow.component";
import { Link } from "react-router-dom";

type ShortCardProps = WithClassname &
  ArrowKind & {
    onClick?: () => void;
    redirect?: string;
  };

const ShortCard: FC<ShortCardProps> = ({
  onClick,
  className = "",
  children,
  redirect,
  ...rest
}) => {
  const body = <span className="w-11/12">{children}</span>;

  return (
    <div
      className={cn(
        "border-nx-red border-3 text-nx-white rounded-lg p-4 flex cursor-pointer hover:bg-nx-white" +
          " hover:text-black hover:border-red-500 transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      <span className="w-11/12">
        {redirect ? <WithLink redirect={redirect}>{body}</WithLink> : body}
      </span>

      <Arrow {...rest} />
    </div>
  );
};

const WithLink: FC<{ redirect: string }> = ({ redirect, children }) => {
  return <Link to={redirect}>{children}</Link>;
};

export { ShortCard };
