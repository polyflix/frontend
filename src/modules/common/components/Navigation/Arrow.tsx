import React, { FC } from "react";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@heroicons/react/solid";

export type ArrowKind = {
  arrow?: "down" | "right" | "left" | "up" | "none";
};

const Arrow: FC<ArrowKind> = ({ arrow }) => {
  switch (arrow) {
    case "down":
      return <ArrowDownIcon className="h-6" />;
    case "left":
      return <ArrowLeftIcon className="h-6" />;
    case "up":
      return <ArrowUpIcon className="h-6" />;
    case "none":
      return null;
    default:
    case "right":
      return <ArrowRightIcon className="h-6" />;
  }
};

export { Arrow };
