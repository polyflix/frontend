import React from "react";
import { cn } from "../../../common/utils/classes.util";
import { WithClassname } from "../../../common/types";
import { GhostListItem } from "./GhostListItem.component";

type Props = WithClassname & {
  count: number;
};

export const GhostList: React.FC<Props> = ({ count, className = "" }) => {
  const ghosts = () => {
    return new Array(count).fill(null);
  };

  return (
    <ul className={cn(className, "w-full")}>
      {ghosts().map((_, i: number) => (
        <GhostListItem key={i} />
      ))}
    </ul>
  );
};
