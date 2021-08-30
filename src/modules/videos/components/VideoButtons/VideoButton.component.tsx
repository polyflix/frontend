import { motion } from 'framer-motion';
import React from 'react';
import { InfoButton } from '../../../ui/components/Buttons/InfoButton/InfoButton.component';
import { PlayButton } from '../../../ui/components/Buttons/PlayButton/PlayButton.component';
import { Video } from '../../models/video.model';

type Props = {
  video: Video
}

export const VideoButtons: React.FC<Props> = ({ video }) => (
  <motion.div className="flex">
    <PlayButton playLink={video.getStreamLink()} />
    <div className="mx-2" />
    <InfoButton infoLink={video.getInfoLink()} />
  </motion.div>
);
