import { InformationCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../common/utils/classes.util";
import { Image } from "../../../ui/components/Image/Image.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import styles from "./video-slider-item.module.scss";
import WatchMetadata from "../../../stats/models/userMeta.model";

type Props = {
  video: Video;
};

type ItemFooterProps = {
  meta: WatchMetadata;
  title: string;
  infoLink: string;
};

export const VideoSliderItem: React.FC<Props> = ({ video }) => {
  return (
    <Link to={video.getStreamLink()}>
      <div className={cn("h-48 2xl:h-72 relative", styles.video_item)}>
        <Image
          className="absolute w-full h-full rounded-md object-cover"
          alt={`${video.title} thumbnail.`}
          src={video.thumbnail}
        />
        {video.userMeta && (
          <ItemFooter
            meta={video.userMeta}
            title={video.title}
            infoLink={video.getInfoLink()}
          />
        )}
      </div>
    </Link>
  );
};

const ItemFooter: React.FC<ItemFooterProps> = ({ meta, title, infoLink }) => {
  return (
    <>
      <div
        className="bg-nx-red absolute bottom-0 h-1 z-10"
        style={{
          width: meta.watchedPercent * 100 + "%",
        }}
      />
      <div
        className={cn(
          "bg-nx-dark absolute w-full p-2 transition-all bg-opacity-80 flex justify-between items-center rounded-b-md",
          styles.video_item_info
        )}
      >
        <Typography bold as="h3">
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
