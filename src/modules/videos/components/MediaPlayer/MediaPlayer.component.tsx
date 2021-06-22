import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import BaseReactPlayer from "react-player/types/base";
import { Link } from "react-router-dom";
import { useAuth } from "../../../authentication";
import { StatsService } from "../../../stats/services/stats.service";
import { Typography } from "../../../ui";
import { Video } from "../../models";

type Props = {
  /** The video we want to play in the player */
  video: Video;
};

/**
 * A basic MediaPlayer component with statistics logic
 */
export const MediaPlayer: React.FC<Props> = ({ video, ..._ }) => {
  const [overlay, setOverlay] = useState<boolean>(true);
  const playerRef = useRef<BaseReactPlayer<any>>(null);
  const { token } = useAuth();
  const statsService = useInjection<StatsService>(StatsService);

  const watchSyncCallback = useCallback(() => {
    if (!playerRef?.current || !token) return;

    let current_time = playerRef.current.getCurrentTime();
    let duration = playerRef.current.getDuration();
    statsService.updateSync({
      videoId: video.id,
      watchedSeconds: current_time,
      watchedPercent: current_time / duration,
    });
  }, [statsService, token, video]);

  const onProgress = () => watchSyncCallback();
  const onSeek = () => watchSyncCallback();

  useEffect(() => {
    if (video.userMeta)
      playerRef.current?.seekTo(video.userMeta.watchedSeconds, "seconds");
    statsService.startTimer(watchSyncCallback);

    return () => {
      watchSyncCallback();
      statsService.stopTimer();
    };
  }, [video.userMeta, token, statsService, watchSyncCallback]);

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
        ref={playerRef}
        onPlay={() => setOverlay(false)}
        onPause={() => setOverlay(true)}
        width="100%"
        height="100vh"
        controls
        playing={true}
        onSeek={onSeek}
        onProgress={onProgress}
        url={video.src}
      />
    </div>
  );
};
