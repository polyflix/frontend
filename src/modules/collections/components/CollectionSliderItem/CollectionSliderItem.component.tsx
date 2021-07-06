import { InformationCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../common/utils/classes.util";
import { Image } from "../../../ui/components/Image/Image.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import styles from "./collection-slider-item.module.scss";
import WatchMetadata from "../../../stats/models/userMeta.model";
import { Video } from "../../../videos";

type Props = {
  currentIndex: number;
  querry: (index: number) => URLSearchParams;
  video: Video;
  isSelected: boolean;
};

type ItemFooterProps = {
  meta: WatchMetadata | undefined;
  title: string;
  infoLink: string;
  isSelected: boolean;
};

export const CollectionSliderItem: React.FC<Props> = ({
  video,
  querry,
  isSelected,
  currentIndex,
}) => {
  return (
    <Link
      to={`${video.getStreamLink()}?${querry(currentIndex)}`}
      className={cn(styles.root, "flex")}
    >
      <div
        className={cn("absolute top-0 left-0 w-full h-full", styles.video_item)}
      >
        <Image
          className="w-full h-full rounded-md object-cover"
          alt={`${video.title} thumbnail.`}
          src={video.thumbnail}
        />
        {
          <ItemFooter
            meta={video.userMeta}
            title={video.title}
            infoLink={`${video.getInfoLink()}?${querry(currentIndex)}`}
            isSelected={isSelected}
          />
        }
      </div>
    </Link>
  );
};

const ItemFooter: React.FC<ItemFooterProps> = ({
  meta,
  title,
  infoLink,
  isSelected,
}) => {
  return (
    <>
      {meta && (
        <div
          className="bg-nx-red absolute bottom-0 h-1 z-10"
          style={{
            width: meta.watchedPercent * 100 + "%",
          }}
        />
      )}
      <div
        className={cn(
          "absolute w-full p-2 transition-all bg-opacity-80 flex justify-between items-center rounded-b-md",
          styles.video_item_info,
          isSelected ? "bg-nx-red" : "bg-nx-dark"
        )}
      >
        <Typography bold as="h3" className="truncate">
          {title}
        </Typography>
        <Link to={infoLink}>
          <Typography as="span">
            <InformationCircleIcon className="w-6" />
          </Typography>
        </Link>
      </div>
    </>
  );
};
