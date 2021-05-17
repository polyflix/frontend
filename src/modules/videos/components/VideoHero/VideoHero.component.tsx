import { motion } from "framer-motion";
import React from "react";
import { applyBackgroundImage, cn } from "../../../common/utils/classes.util";
import { NoData } from "../../../ui/components/NoData/NoData.component";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import { VideoButtons } from "../VideoButtons/VideoButton.component";

type Props = {
  video: Video;
};

export const VideoHero: React.FC<Props> = ({ video }) => {
  return video ? (
    <>
      <div
        style={applyBackgroundImage(video.thumbnail)}
        className={cn("h-screen")}
      >
        <motion.div
          className="w-full md:w-6/12 lg:w-4/12 h-full bg-black bg-opacity-50 flex flex-col justify-center px-5"
          style={{
            boxShadow: "0 0 80px 110px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography as="h1" className="text-4xl md:text-6xl" bold>
            {video.title}
          </Typography>
          <Paragraph className="my-5">{video.shortDescription}</Paragraph>
          <VideoButtons video={video} />
        </motion.div>
      </div>
    </>
  ) : (
    <NoData />
  );
};
