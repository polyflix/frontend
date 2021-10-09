import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { Block } from "@polyflix/vtt-parser";
import { usePlayerContext } from "@vime/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { WithClassname, RootState, cn } from "../../common";
import { Typography } from "../../ui";
import { Video } from "../../videos";
import { SubtitleFetchingState } from "../pages/collaborative-subtitle-editing.page";
import { SubtitleBlockContent } from "./subtitle-block-content.component";

type SubtitleBlockProps = WithClassname & {
  playerRef: React.RefObject<HTMLVmPlayerElement>;
  block: Block;
  subtitles: SubtitleFetchingState;
  video: Video;
};

export const SubtitleBlock: React.FC<SubtitleBlockProps> = ({
  playerRef,
  className = "",
  block,
  subtitles,
  video,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentTime, setCurrentTime] = usePlayerContext(
    playerRef,
    "currentTime",
    0
  );

  const blockText = useSelector(
    (state: RootState) =>
      state.subtitleImprovement.find((e) => e.timestamp === block.startTime)
        ?.text
  );

  const goToMilis = (millis: number): void => {
    const player: HTMLVmPlayerElement | null = playerRef.current;

    if (!player?.playing) {
      player?.play().then(() => {
        player.currentTime = millis / 1000;
      });
    } else {
      setCurrentTime(millis / 1000);
    }
  };

  const formatMilis = (milis: number): string => {
    const minutes = Math.round(milis / 1000 / 60);
    const secondes = Math.round((milis / 1000) % 60);

    const parsedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const parsedSeconds = secondes < 10 ? `0${secondes}` : `${secondes}`;

    return `${parsedMinutes}:${parsedSeconds}`;
  };

  const isCurrent = (block: Block): boolean => {
    return (
      block.startTime / 1000 <= currentTime &&
      block.endTime / 1000 > currentTime
    );
  };

  return (
    <>
      <div
        className={cn(
          className,
          "flex flex-row items-center justify-start group"
        )}
      >
        <span
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-5 h-5 mr-2 text-nx-red hover:hidden cursor-pointer group-hover:opacity-100",
            !isOpen && "opacity-0",
            !isCurrent(block) && !isOpen && "text-opacity-50",
            isCurrent(block) && "opacity-100",
            "hover:text-opacity-100"
          )}
        >
          {isOpen ? <XIcon /> : <PencilIcon />}
        </span>
        <div
          className={cn(
            "flex flex-row box-border items-center justify-start group cursor-pointer pt-2 pb-2 w-full",
            isCurrent(block) &&
              "border-l-2 border-nx-red pl-0 relative bg-darkgray"
          )}
          onClick={() => goToMilis(block.startTime)}
        >
          <Typography as="span" className="ml-2 mr-4 w-14 lg:block">
            {formatMilis(block.startTime)}
          </Typography>
          <Typography as="p" className="group-hover:text-nx-red">
            {blockText}
          </Typography>
        </div>
      </div>
      {isOpen && (
        <SubtitleBlockContent
          block={block}
          subtitles={subtitles}
          video={video}
        />
      )}
    </>
  );
};
