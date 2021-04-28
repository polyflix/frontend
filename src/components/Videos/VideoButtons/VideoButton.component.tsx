import { motion } from "framer-motion";
import React from "react";
import Video from "../../../models/video.model";
import InfoButton from "../../Buttons/InfoButton/InfoButton.component";
import PlayButton from "../../Buttons/PlayButton/PlayButton.component";

type Props = {
  video: Video;
};

const VideoButtons: React.FC<Props> = ({ video }) => {
  return (
    <motion.div className="flex">
      <PlayButton playLink={video.getStreamLink()} />
      <div className="mx-2"></div>
      <InfoButton infoLink={video.getInfoLink()} />
    </motion.div>
  );
};

export default VideoButtons;
