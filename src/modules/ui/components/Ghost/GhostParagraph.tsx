import React from "react";
import { WithClassname } from "../../../common/types";
import { cn } from "../../../common/utils/classes.util";
import { GhostText } from "./GhostText.component";

type Props = WithClassname & {
  count: number;
};

/**
 * @param {number} count -- Number of lines shown
 * @param className
 * @constructor
 */
export const GhostParagraph: React.FC<Props> = ({ count, className = "" }) => {
  const ghosts = () => {
    return new Array(count).fill(null);
  };

  return (
    <div className="flex flex-col w-full">
      {ghosts().map((_, i: number) => (
        <GhostText
          key={i}
          className={cn(
            "my-1 ",
            i === 0 ? "h-3 mb-2" : "h-2.5",
            i === 0 && "w-4/6",
            i === count - 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
};
