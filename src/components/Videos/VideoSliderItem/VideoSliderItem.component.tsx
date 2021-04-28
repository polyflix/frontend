import { InformationCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import Video from "../../../models/video.model";
import { cn } from "../../../utils/classes.util";
import Image from "../../Image/Image.component";
import Typography from "../../Typography/Typography.component";
import styles from "./video-slider-item.module.scss";

type Props = {
  video: Video;
};

const VideoSliderItem: React.FC<Props> = ({ video }) => {
  return (
    <Link to={video.getStreamLink()}>
      <div className={cn("h-48 2xl:h-72 relative", styles.video_item)}>
        <Image
          className="absolute w-full h-full rounded-md"
          alt={`${video.title} thumbnail.`}
          src={video.thumbnail}
        />
        <div
          className={cn(
            "bg-nx-dark absolute w-full p-2 transition-all bg-opacity-80 flex justify-between items-center rounded-b-md",
            styles.video_item_info
          )}
        >
          <Typography bold as="h3">
            {video.title}
          </Typography>
          <Link to={video.getInfoLink()}>
            <Typography as="span">
              <InformationCircleIcon className="w-6" />
            </Typography>
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default VideoSliderItem;
