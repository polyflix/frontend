import React from "react";
import { cn } from "../../../../common/utils/classes.util";
import { WithClassname } from "../../../../common/types";
import styles from "./GhostTile.module.scss";
import ghost_styles from "../Ghost.module.scss";

export const GhostTile: React.FC<WithClassname> = ({ className = "" }) => {
  return <div className={cn(className, styles.root, ghost_styles.ghost)}></div>;
};
