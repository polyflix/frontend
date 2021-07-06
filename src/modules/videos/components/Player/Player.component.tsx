import React, { useEffect, useRef } from "react";
import { Subtitle } from "../../models/subtitle.model";
import {
  DefaultUi,
  Player as PlayerVime,
  Video,
  Vimeo,
  Youtube,
  usePlayerContext,
} from "@vime/react";
import { useAuth } from "../../../authentication";
import { useInjection } from "@polyflix/di";
import { StatsService } from "../../../stats/services/stats.service";
import WatchMetadata from "../../../stats/models/userMeta.model";
import { Track } from "../../types/track.type";
import { ProviderType } from "../../types";

type Props = {
  videoUrl: string;
  videoSubtitles: Subtitle[];
  videoId: string;
  userMeta?: WatchMetadata;
};

const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_VIMEO = /vimeo\.com\/.+/;

export const Player: React.FC<Props> = ({
  videoUrl,
  userMeta,
  videoSubtitles,
  videoId,
}) => {
  const player = useRef<HTMLVmPlayerElement>(null);
  const { token } = useAuth();
  const statsService = useInjection<StatsService>(StatsService);

  const [durationTime] = usePlayerContext(player, "duration", 0);
  const [currentTime, setCurrentTime] = usePlayerContext(
    player,
    "currentTime",
    0
  );

  const onTriggerWatchtimeEvent = () => {
    if (!player?.current || !token) return;
    console.debug(
      "[updateSync] durationTime: ",
      durationTime,
      "currentTime: ",
      currentTime
    );
    statsService.updateSync({
      videoId: videoId,
      watchedSeconds: currentTime,
      watchedPercent: currentTime / durationTime,
    });
  };

  const onTimeUpdate = (event: CustomEvent<number>) => {
    setCurrentTime(event.detail);
  };

  const onPlaybackStarted = () => {
    if (userMeta) setCurrentTime(userMeta.watchedSeconds);
  };

  useEffect(onTriggerWatchtimeEvent, [
    currentTime,
    durationTime,
    player,
    statsService,
    token,
    videoId,
    onTriggerWatchtimeEvent,
  ]);

  useEffect(() => {
    statsService.startTimer(onTriggerWatchtimeEvent);

    return () => {
      onTriggerWatchtimeEvent();
      statsService.stopTimer();
    };
    // We disable eslint on the next line, else it would prompt a warning on
    // on the fact that onTriggerWatchTimeEvent is not in dependency array.
    // But we know tat it is a constant that won't move at all
    // eslint-disable-next-line
  }, [statsService]);

  return (
    <PlayerVime
      playsinline
      ref={player}
      onVmSeeked={onTriggerWatchtimeEvent}
      onVmCurrentTimeChange={onTimeUpdate}
      currentTime={currentTime}
      onVmPlaybackStarted={onPlaybackStarted}
    >
      <Provider videoUrl={videoUrl} videoSubtitles={videoSubtitles} />
      <DefaultUi>{/* Custom UI Component. */}</DefaultUi>
    </PlayerVime>
  );
};

/**
 * Depending on the video source we extend the proper video player
 * @param videoUrl
 * @param videoSubtitles
 * @constructor
 */
const Provider: React.FC<Omit<Props, "videoId">> = ({
  videoUrl,
  videoSubtitles,
}) => {
  const [provider, url] = getProvider(videoUrl);
  const tracks = getTracks(videoSubtitles);

  switch (provider) {
    case ProviderType.VIDEO:
      return (
        <Video>
          <source data-src={url} type="video/mp4" />
          {tracks.map((track) => (
            <track {...track} />
          ))}
        </Video>
      );
    case ProviderType.VIMEO:
      return <Vimeo videoId={url} />;
    case ProviderType.YOUTUBE:
      return <Youtube videoId={url} cookies={false} />;
    default:
      return <p>Video type unknown</p>;
  }
};

/**
 * Format tracks in order to be imported properly
 * @param videoSubtitles
 */
function getTracks(videoSubtitles: Subtitle[]) {
  let tracks: Track[] = [];
  for (const subtitle of videoSubtitles) {
    tracks.push({
      kind: "captions",
      label: subtitle.lang,
      srclang: subtitle.lang,
      src: subtitle.vttUrl,
      default: tracks.length === 0, // 1st is default
    });
  }
  return tracks;
}

/**
 * Find the video provider from the video url
 * @param videoUrl The video url
 * @returns The provider : 'youtube' | 'vimeo' | 'html5'
 */
function getProvider(videoUrl: string): [ProviderType, string] {
  let provider: [ProviderType, string];
  if (MATCH_URL_YOUTUBE.test(videoUrl)) {
    provider = [ProviderType.YOUTUBE, videoUrl.split("?v=")[1]];
  } else if (MATCH_URL_VIMEO.test(videoUrl)) {
    const match = videoUrl.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);
    if (!match) return [ProviderType.UNKNOWN, ""];
    provider = [ProviderType.VIMEO, match[2]];
  } else {
    provider = [ProviderType.VIDEO, videoUrl];
  }
  return provider;
}
