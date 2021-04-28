import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { default as VideoEntity } from "../../models/video.model";
import Typography from "../Typography/Typography.component";

type Props = {
  /** The video we want to play in the player */
  video: VideoEntity;
};

/**
 * A basic MediaPlayer component.
 */
const MediaPlayer: React.FC<Props> = ({ video, ...rest }) => {
  const [overlay, setOverlay] = useState<boolean>(true);

  return (
    <div className="h-screen w-screen fixed bg-black top-0 left-0 z-50">
      <div
        style={{ top: overlay ? 0 : "-100px" }}
        className="absolute transition-all bg-black w-full bg-opacity-50 left-0 flex py-4 px-3 items-center justify-between text-nx-white z-50"
      >
        <span className="flex items-center">
          <Link to={video.getInfoLink()}>
            <ArrowLeftIcon className="w-8 transition-all hover:text-nx-red" />
          </Link>
          <span className="mx-2" />
          <Typography as="h1" className="text-lg">
            {video.title}
          </Typography>
        </span>
        <span className="flex items-center">
          <InformationCircleIcon className="w-8" />
        </span>
      </div>
      <ReactPlayer
        onPlay={() => setOverlay(false)}
        onPause={() => setOverlay(true)}
        width="100%"
        height="100vh"
        controls
        url="https://media.vimejs.com/720p.mp4"
      />
    </div>
  );
};

export default MediaPlayer;
