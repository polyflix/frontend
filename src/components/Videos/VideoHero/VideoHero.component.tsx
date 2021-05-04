import { motion } from "framer-motion";
import React from "react";
import Video from "../../../models/video.model";
import { applyBackgroundImage } from "../../../utils/classes.util";
import Paragraph from "../../Typography/Paragraph/Paragraph.component";
import Typography from "../../Typography/Typography.component";
import NoData from "../../NoData/NoData";
import VideoButtons from "../VideoButtons/VideoButton.component";
import ReactPlayer from "react-player";
import { NAV_HEIGHT } from "@ui/components/Navigation/Navigation.component";

type Props = {
  video: Video;
};

/**
 * Return style for background image, nothing if there is a preview video available.
 * @param {Video} video the video with the background.
 */
function showBackgroundImage(video: Video) {
  if (!video.videoPreviewURL || video.videoPreviewURL === "") {
    return applyBackgroundImage(video.thumbnail);
  }
  return {};
}

const VideoHero: React.FC<Props> = ({ video }) => {
  return video ? (
    <>
      <div
        style={{
          height: "52.25vw",
          marginTop: NAV_HEIGHT,
          ...showBackgroundImage(video),
        }}
        className="relative mb-5 overflow-hidden"
      >
        <motion.div
          className="absolute top-0 left-0 right-0 z-30 bg-black bg-opacity-40 flex flex-col justify-center pl-5 h-full"
          style={{ height: "53.25vw" }}
        >
          <Typography as="h1" className="text-xl py-5 md:text-6xl md:pt-0" bold>
            {video.title}
          </Typography>
          <Paragraph className="py-5 hidden md:block md:w-1/2">
            {video.shortDescription}
          </Paragraph>
          <VideoButtons video={video} />
        </motion.div>

        {video.videoPreviewURL && (
          <ReactPlayer
            width="100%"
            height="100%"
            url={video.videoPreviewURL}
            playing
            muted
            loop
            className="absolute top-0 left-0 right-0 z-10 min-w-full min-h-full"
          ></ReactPlayer>
        )}
      </div>
    </>
  ) : (
    <NoData />
  );
};

export default VideoHero;
