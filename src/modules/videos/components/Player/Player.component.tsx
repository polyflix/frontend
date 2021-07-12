import React, { useEffect } from "react";
import { Subtitle } from "../../models/subtitle.model";
import {
  DefaultUi,
  Player as PlayerVime,
  Video,
  Vimeo,
  Youtube,
} from "@vime/react";
import { useAuth } from "../../../authentication";
import { useInjection } from "@polyflix/di";
import { WatchtimeSyncService } from "../../../stats/services/watchtime-sync.service";
import WatchMetadata from "../../../stats/models/userMeta.model";
import { Track } from "../../types/track.type";
import { ProviderType } from "../../types";

type Props = {
  videoUrl: string;
  videoSubtitles: Subtitle[];
  videoId: string;
  userMeta?: WatchMetadata;
  playerRef: React.RefObject<HTMLVmPlayerElement>;
};

const MATCH_URL_YOUTUBE =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
const MATCH_URL_VIMEO = /vimeo\.com\/.+/;

const PLAYER_VOLUME_DOWN_STEP = 10;
const PLAYER_VOLUME_UP_STEP = 10;
const PLAYER_MOVE_FORWARD_STEP = 13;
const PLAYER_MOVE_BACKWARD_STEP = 10;

export const Player: React.FC<Props & { onVideoEnd: () => void }> = ({
  videoUrl,
  userMeta,
  videoSubtitles,
  videoId,
  playerRef,
  onVideoEnd,
}) => {
  const { token } = useAuth();
  const statsService = useInjection<WatchtimeSyncService>(WatchtimeSyncService);

  const onTriggerWatchtimeEvent = () => {
    if (
      !playerRef?.current ||
      !token ||
      [0, -1].indexOf(playerRef.current.duration) > -1
    )
      return;
    statsService.updateSync({
      videoId: videoId,
      watchedSeconds: playerRef.current.currentTime,
      watchedPercent:
        playerRef.current.currentTime / playerRef.current.duration,
    });
  };

  const keyboardListener = (event: KeyboardEvent) => {
    if (!playerRef?.current) return;
    const player = playerRef?.current;

    // Play / Pause the video
    if (event.key === "k" || event.key === " ") {
      if (player?.paused) {
        player?.play();
      } else {
        player?.pause();
      }
    }

    // Mute the video
    if (event.key === "m") {
      if (player?.muted) {
        player.muted = false;
      } else {
        player.muted = true;
      }
    }

    // enter / exit fullscreen
    if (event.key === "f") {
      if (player?.isFullscreenActive) {
        player?.exitFullscreen();
      } else {
        player?.enterFullscreen();
      }
    }

    // Volume up
    if (event.key === "ArrowUp") {
      let vol = player?.volume;
      let nextVol = vol + PLAYER_VOLUME_UP_STEP;
      if (nextVol > 100) nextVol = 100;
      player.volume = nextVol;
    }

    // Volume down
    if (event.key === "ArrowDown") {
      let vol = player?.volume;
      let nextVol = vol - PLAYER_VOLUME_DOWN_STEP;
      if (nextVol < 0) nextVol = 0;
      player.volume = nextVol;
    }

    // Move forward
    if (event.key === "ArrowLeft") {
      let time = player.currentTime;
      let nextTime = time - PLAYER_MOVE_BACKWARD_STEP;
      if (nextTime < 0) nextTime = 0;
      player.currentTime = nextTime;
    }

    // Move backwark
    if (event.key === "ArrowRight") {
      let time = player.currentTime;
      let nextTime = time + PLAYER_MOVE_FORWARD_STEP;
      if (nextTime > player.duration) nextTime = player.duration;
      player.currentTime = nextTime;
    }

    // toggle captions
    if (event.key === "c") {
      if (player.isTextTrackVisible) {
        player.setTextTrackVisibility(false);
      } else {
        player.setTextTrackVisibility(true);
      }
    }

    // toggle captions
    if (event.key === "p") {
      if (player.isPiPActive) {
        player.exitPiP();
      } else {
        player.enterPiP();
      }
    }
  };

  const onPlaybackStart = () => {
    if (playerRef?.current && userMeta?.watchedSeconds)
      playerRef.current.currentTime = userMeta.watchedSeconds;
  };

  useEffect(onTriggerWatchtimeEvent, [
    playerRef,
    statsService,
    token,
    videoId,
    onTriggerWatchtimeEvent,
  ]);

  useEffect(() => {
    document.addEventListener("keydown", keyboardListener);
    return () => document.removeEventListener("keydown", keyboardListener);
  });

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
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <div className="absolute top-0 left-0 w-full">
        <PlayerVime
          playsinline
          ref={playerRef}
          onVmSeeked={onTriggerWatchtimeEvent}
          onVmPlaybackStarted={onPlaybackStart}
          onVmPlaybackEnded={onVideoEnd}
        >
          <Provider videoUrl={videoUrl} videoSubtitles={videoSubtitles} />
          <DefaultUi></DefaultUi>
        </PlayerVime>
      </div>
    </div>
  );
};

/**
 * Depending on the video source we extend the proper video player
 * @param videoUrl
 * @param videoSubtitles
 * @constructor
 */
const Provider: React.FC<Omit<Props, "videoId" | "playerRef">> = ({
  videoUrl,
  videoSubtitles,
}) => {
  const [provider, url] = getProvider(videoUrl);
  const tracks = getTracks(videoSubtitles);

  switch (provider) {
    case ProviderType.VIDEO:
      return (
        <Video crossOrigin="use-credentials">
          <source data-src={url} type="video/mp4" />
          {tracks.map((track, i) => (
            <track {...track} key={i} />
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
      kind: "subtitles",
      label: subtitle.lang,
      srcLang: subtitle.lang,
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
    const match = videoUrl.match(MATCH_URL_YOUTUBE);
    provider = [
      ProviderType.YOUTUBE,
      match && match[7].length === 11 ? match[7] : "",
    ];
  } else if (MATCH_URL_VIMEO.test(videoUrl)) {
    const match = videoUrl.match(MATCH_URL_VIMEO);
    if (!match) return [ProviderType.UNKNOWN, ""];
    provider = [ProviderType.VIMEO, match[0].split("/")[1]];
  } else {
    provider = [ProviderType.VIDEO, videoUrl];
  }
  return provider;
}
