import React from "react";
import { WithClassname } from "../../../common/types";
import { cn } from "../../../common/utils/classes.util";
import styles from "./Ghost.module.scss";

export const GhostText: React.FC<WithClassname> = ({ className = "" }) => {
  return <p className={cn("h-4 flex", className, styles.ghost)}></p>;
};
