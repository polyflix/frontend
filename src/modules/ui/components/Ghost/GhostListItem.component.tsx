import React from "react";
import { WithClassname } from "../../../common/types";
import { cn } from "../../../common/utils/classes.util";
import styles from "./Ghost.module.scss";
import { GhostText } from "./GhostText.component";
import { GhostTitle } from "./GhostTitle.component";

export const GhostListItem: React.FC<WithClassname> = ({ className = "" }) => {
  return (
    <li className={className}>
      <span className={cn("h-10 w-10 rounded-full flex", styles.ghost)}></span>
      <GhostTitle className="h-2 my-1" />
      <GhostText className="h-1 my-1 w-9/12" />
    </li>
  );
};
