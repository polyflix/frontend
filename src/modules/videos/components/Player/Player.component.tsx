import React, { useCallback, useEffect, useState } from "react";
import { Subtitle } from "../../models/subtitle.model";
import {
  Captions,
  ClickToPlay,
  DblClickFullscreen,
  DefaultControls,
  DefaultSettings,
  LoadingScreen,
  Player as PlayerVime,
  Poster,
  Ui,
  Video,
  Youtube,
} from "@vime/react";
import { useAuth } from "../../../authentication";
import { useInjection } from "@polyflix/di";
import { WatchtimeSyncService } from "../../../stats/services/watchtime-sync.service";
import WatchMetadata from "../../../stats/models/userMeta.model";
import { VideoSource } from "../../types";
import { MinioService } from "../../../upload/services/minio.service";
import { ErrorCard } from "../../../common/components/ErrorCard/ErrorCard.component";
import { Track } from "../../types/track.type";

type Props = {
  videoSubtitles?: Subtitle[];
  videoId: string;
  userMeta?: WatchMetadata;
  playerRef: React.RefObject<HTMLVmPlayerElement>;
  /**
   * Kind of video loaded
   */
  videoSourceType: VideoSource;
  /**
   * If it is a youtube video, we want the target ID
   */
  rawVideoSource: string;
  /**
   * Thumbnail of video, used as poster for player
   */
  videoThumbnail: string;
};

const PLAYER_VOLUME_DOWN_STEP = 10;
const PLAYER_VOLUME_UP_STEP = 10;
const PLAYER_MOVE_FORWARD_STEP = 13;
const PLAYER_MOVE_BACKWARD_STEP = 10;

/**
 * Type used to fetch the stream Url
 */
type streamUrlHookType = [
  streamUrl: string | null,
  error: string | null,
  loading: boolean
];

const useStreamUrl = (
  videoId: string,
  videoSourceType: VideoSource,
  videoSource: string
): streamUrlHookType => {
  const minioService = useInjection<MinioService>(MinioService);
  const { isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || streamUrl) return;
    if (
      videoSourceType === VideoSource.YOUTUBE ||
      videoSourceType === VideoSource.UNKNOWN
    ) {
      setStreamUrl(videoSource);
      setLoading(false);
      return;
    }

    minioService
      .getVideoPresignedUrl(videoId)
      .then(({ tokenAccess }) => {
        setStreamUrl(tokenAccess);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [
    authLoading,
    videoId,
    loading,
    streamUrl,
    minioService,
    videoSourceType,
    videoSource,
  ]);
  return [streamUrl, error, loading];
};

export const Player: React.FC<Props & { onVideoEnd: () => void }> = ({
  userMeta,
  videoId,
  playerRef,
  onVideoEnd,
  rawVideoSource,
  videoSourceType,
  videoThumbnail,
}) => {
  const { token } = useAuth();
  const statsService = useInjection<WatchtimeSyncService>(WatchtimeSyncService);
  const [streamUrl, streamUrlError, loading] = useStreamUrl(
    videoId,
    videoSourceType,
    rawVideoSource
  );
  const [mediaError, setMediaError] = useState<string>();

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

  const keyboardListener = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [playerRef]
  );

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
    if (streamUrl && !mediaError && !streamUrlError)
      document.addEventListener("keydown", keyboardListener);
    return () => document.removeEventListener("keydown", keyboardListener);
  }, [keyboardListener, streamUrl, mediaError, streamUrlError]);

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
        {(mediaError || streamUrlError) && (
          <div
            style={{ zIndex: 999 }}
            className="absolute w-full h-full bg-black bg-opacity-40"
          >
            <ErrorCard />
          </div>
        )}
        <PlayerVime
          playsinline
          ref={playerRef}
          onVmSeeked={onTriggerWatchtimeEvent}
          onVmPlaybackStarted={onPlaybackStart}
          onVmPlaybackEnded={onVideoEnd}
          currentPoster={videoThumbnail}
          onVmError={(e) => {
            if (e.detail instanceof MediaError) {
              setMediaError(`${e.detail.message} - Code ${e.detail.code}`);
            }
          }}
        >
          <Provider
            rawVideoSource={streamUrl ?? ""}
            videoSourceType={videoSourceType}
          />
          <Ui>
            <DblClickFullscreen />
            <Captions />
            <LoadingScreen hideDots={streamUrlError !== null} />
            <div className="opacity-50">
              <Poster />
            </div>
            {streamUrl && !loading && <DefaultControls />}
            {streamUrl && !loading && <DefaultSettings />}
            {streamUrl && !loading && <ClickToPlay />}
          </Ui>
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
const Provider: React.FC<
  Omit<Props, "videoId" | "playerRef" | "videoThumbnail">
> = ({ videoSubtitles, videoSourceType, rawVideoSource: streamUrl }) => {
  const tracks = getTracks(videoSubtitles ?? []);

  switch (videoSourceType) {
    case VideoSource.YOUTUBE:
      return <Youtube videoId={streamUrl} cookies={false} />;
    case VideoSource.INTERNAL:
      return (
        <Video crossOrigin="use-credentials">
          <source data-src={streamUrl} type="video/mp4" />
          {tracks.map((track, i) => (
            <track {...track} key={i} />
          ))}
        </Video>
      );
    case VideoSource.UNKNOWN:
      return (
        <Video crossOrigin="use-credentials">
          <source data-src={streamUrl} type="video/mp4" />
        </Video>
      );
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
