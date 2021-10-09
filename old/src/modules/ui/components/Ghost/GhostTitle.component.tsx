import React from "react";
import { WithClassname } from "../../../common/types";
import { cn } from "../../../common/utils/classes.util";
import styles from "./Ghost.module.scss";

export const GhostTitle: React.FC<WithClassname> = ({ className = "" }) => {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h4 className={cn(className, "h-4 flex", styles.ghost)}></h4>
  );
};
