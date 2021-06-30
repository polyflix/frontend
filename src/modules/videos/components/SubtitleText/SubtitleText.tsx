import { PropsWithChildren } from "react";
import { Block } from "@polyflix/vtt-parser";

/**
 * The subtitle text sequence component
 */
export const SubtitleText: React.FC<PropsWithChildren<{ block: Block }>> = ({
  block,
}) => {
  return <span>{`${block.text} `}</span>;
};
