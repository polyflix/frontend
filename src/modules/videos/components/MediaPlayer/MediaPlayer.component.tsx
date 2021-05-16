import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";

type Props = {
  /** The video we want to play in the player */
  video: Video;
};

/**
 * A basic MediaPlayer component.
 */
export const MediaPlayer: React.FC<Props> = ({ video, ...rest }) => {
  const [overlay, setOverlay] = useState<boolean>(true);

  return (
    <div className="h-screen w-screen fixed bg-black top-0 left-0 z-50">
      <div
        style={{ top: overlay ? 0 : "-100px" }}
        className="absolute transition-all bg-black w-full bg-opacity-50 left-0 flex py-4 px-3 items-center justify-between text-nx-white z-50"
      >
        <span className="flex items-center">
          <Link to="/">
            <ArrowLeftIcon className="w-8 transition-all hover:text-nx-red" />
          </Link>
          <span className="mx-2" />
          <Typography as="h1" className="text-lg">
            {video.title}
          </Typography>
        </span>
        <Link to={video.getInfoLink()} className="flex items-center">
          <InformationCircleIcon className="w-8" />
        </Link>
      </div>
      <ReactPlayer
        onPlay={() => setOverlay(false)}
        onPause={() => setOverlay(true)}
        width="100%"
        height="100vh"
        controls
        playing={true}
        url="https://media.vimejs.com/720p.mp4"
      />
    </div>
  );
};
