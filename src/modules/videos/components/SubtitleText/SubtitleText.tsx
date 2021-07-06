import { PropsWithChildren } from "react";
import { Block } from "@polyflix/vtt-parser";
import { usePlayerContext } from "@vime/react";

/**
 * The subtitle text sequence component
 */
export const SubtitleText: React.FC<
  PropsWithChildren<{
    block: Block;
    playerRef: React.RefObject<HTMLVmPlayerElement>;
  }>
> = ({ block, playerRef }) => {
  const [currentTime, setCurrentTime] = usePlayerContext(
    playerRef,
    "currentTime",
    0
  );

  return (
    <span
      className={`cursor-pointer ${
        block.startTime / 1000 <= currentTime &&
        block.endTime / 1000 > currentTime &&
        "text-nx-red transition-all"
      }`}
      onClick={() => setCurrentTime(block.startTime / 1000)}
    >{`${block.text} `}</span>
  );
};
