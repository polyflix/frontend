import React from "react";
import { applyBackgroundImage } from "../../../common/utils/classes.util";
import { NoData } from "../../../ui/components/NoData/NoData.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import { VideoSource } from "../../types";
import { VideoButtons } from "../VideoButtons/VideoButton.component";
import { useStreamUrl } from "../../hooks/useStreamUrl.hook";
import { Paragraph } from "../../../ui";
import {cn} from '../../../common/utils'
import { motion } from "framer-motion";

type Props = {
  video: Video
}

export const VideoHero: React.FC<Props> = ({ video }) => {
  const { streamUrl, error, loading } = useStreamUrl(video);

  return video ? (
    <>
      <div
        style={applyBackgroundImage(video.thumbnail)}
        className="relative flex items-center justify-center h-screen mb-12 overflow-hidden"
      >
        <div className="absolute z-30 p-5 text-2xl text-white left-4">
          <Typography as="h1" className="text-4xl md:text-6xl" bold>
            {video.shortTitle}
          </Typography>
          <Paragraph className="my-5">{video.shortDescription}</Paragraph>
          <VideoButtons video={video} />
        </div>
        {video && video.srcType === VideoSource.INTERNAL && !loading && !error && (
          <video
            autoPlay
            loop
            muted
            className="absolute z-10 min-w-full min-h-full max-w-none w-full h-full object-cover"
          >
            <source src={streamUrl} type="video/mp4" />
          </video>
        )}
      </div>
    </>
  ) : (
    <div
      style={applyBackgroundImage(video.thumbnail)}
      className={cn(
        'min-h-500 landscape:h-screen landscape:min-h-full h-screen-50vh md:h-screen',
      )}
    >
      <motion.div
        className="w-full md:w-6/12 lg:w-4/12 h-full bg-black bg-opacity-50 flex flex-col justify-center px-5"
        style={{
          boxShadow: '0 0 80px 110px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography as="h1" className="text-4xl md:text-6xl" bold>
          {video.shortTitle}
        </Typography>
        <Paragraph className="my-5">{video.shortDescription}</Paragraph>
        <VideoButtons video={video} />
      </motion.div>
    </div>
) : (
  <div
    style={{
      minHeight: '200px',
      height: '80vh',
    }}
    className="flex items-center justify-center border-b-2 border-nx-dark"
  >
    <NoData />
  </div>
));
