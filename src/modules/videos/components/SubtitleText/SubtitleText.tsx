import { PropsWithChildren, useRef } from "react";
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
  const blockRef = useRef<HTMLDivElement>(null);
  const executeScroll = () =>
    blockRef?.current?.scrollIntoView({ block: "center" });

  const isCurrent =
    block.startTime / 1000 <= currentTime && block.endTime / 1000 > currentTime;

  isCurrent && executeScroll();

  return (
    <span
      ref={blockRef}
      className={`cursor-pointer whitespace-pre-line ${
        isCurrent && "text-nx-red transition-all"
      }`}
      onClick={() => setCurrentTime(block.startTime / 1000)}
    >
      {`${block.text.replace(".", ".\n")} `}
    </span>
  );
};
