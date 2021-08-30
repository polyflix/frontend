import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  ClickToPlay,
  DblClickFullscreen,
  DefaultControls,
  DefaultSettings,
  LoadingScreen,
  Player as PlayerVime,
  Video as VideoVime,
  Poster,
  Ui,
  Youtube,
} from '@vime/react';
import { useInjection } from '@polyflix/di';
import { VttFile } from '@polyflix/vtt-parser';
import { Subtitle } from '../../models/subtitle.model';
import { useAuth } from '../../../authentication';
import { WatchtimeSyncService } from '../../../stats/services/watchtime-sync.service';
import { VideoSource } from '../../types';
import { MinioService } from '../../../upload/services/minio.service';
import { ErrorCard } from '../../../common/components/ErrorCard/ErrorCard.component';
import { Track } from '../../types/track.type';
import { Video } from '../../models';

type Props = {
  video: Video
  /**
   * Reference used for the player & sync of subtitles
   */
  playerRef: React.RefObject<HTMLVmPlayerElement>
  /**
   * ??
   */
  onVideoEnd: () => void
}

const PLAYER_VOLUME_DOWN_STEP = 10;
const PLAYER_VOLUME_UP_STEP = 10;
const PLAYER_MOVE_FORWARD_STEP = 13;
const PLAYER_MOVE_BACKWARD_STEP = 10;

/**
 * Type used to fetch the stream Url
 */
type streamUrlHookType = {
  streamUrl?: string
  error?: string
  loading: boolean
}

/**
 * Inside hook in order to fetch a presigned URL for a video
 * @param {string} srcRaw -- Raw source of a video (youtube id, minio file path...)
 * @param {VideoSource} srcType -- KInd of video fetched (Youtube, internal...)
 * @param {src} src -- When youtube or unknown video, the streaming link can be formed instantly
 * @param {string} id -- Video ID
 */
const useStreamUrl = ({
  srcRaw,
  srcType,
  src,
  id,
}: Video): streamUrlHookType => {
  const minioService = useInjection<MinioService>(MinioService);
  const { isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [streamUrl, setStreamUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  /*
   * Fetch a Presigned Url for a video
   */
  useEffect(() => {
    if (authLoading || streamUrl) return;
    if (srcType === VideoSource.YOUTUBE || srcType === VideoSource.UNKNOWN) {
      setStreamUrl(src);
      setLoading(false);
      return;
    }

    minioService
      .getVideoPresignedUrl(id)
      .then(({ tokenAccess }) => {
        setStreamUrl(tokenAccess);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [authLoading, id, loading, streamUrl, minioService, srcType, src, srcRaw]);
  return { streamUrl, error, loading };
};

type UseSubtitlesProps = {
  subtitles?: Subtitle[]
  loading: boolean
}

const useSubtitles = ({
  availableLanguages,
  id,
  srcType,
}: Video): UseSubtitlesProps => {
  const minioService = useInjection<MinioService>(MinioService);
  const { isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [subtitles, setSubtitles] = useState<Subtitle[] | undefined>();

  const fetchSubtitles = useCallback(async () => {
    const fetchedSubtitles: Subtitle[] = [];
    for (let i = 0; i < availableLanguages.length; i++) {
      const lang = availableLanguages[i];
      try {
        const { tokenAccess } = await minioService.getSubtitlePresignedUrl(
          id,
          lang,
        );
        fetchedSubtitles.push(
          new Subtitle(lang, tokenAccess, await VttFile.fromUrl(tokenAccess)),
        );
      } catch (e) {
        console.error('Failed to fetch subtitle ', lang);
        console.error(e);
      }
    }
    setLoading(false);
    setSubtitles(fetchedSubtitles);
  }, [minioService, availableLanguages, id]);

  useEffect(() => {
    if (authLoading || subtitles) return;
    if (srcType !== VideoSource.INTERNAL || availableLanguages.length === 0) {
      setSubtitles([]);
      setLoading(false);
      return;
    }

    // Add .finally to avoid warning about unprocessed promise
    fetchSubtitles().finally();
  }, [
    authLoading,
    fetchSubtitles,
    subtitles,
    availableLanguages.length,
    srcType,
  ]);

  return {
    loading,
    subtitles,
  };
};

export const Player: React.FC<Props> = ({ playerRef, onVideoEnd, video }) => {
  const { token } = useAuth();
  const hostRef = useRef<HTMLDivElement>(null);
  const statsService = useInjection<WatchtimeSyncService>(WatchtimeSyncService);
  const {
    streamUrl,
    error: streamUrlError,
    loading: videoLoading,
  } = useStreamUrl(video);
  const { subtitles, loading: subtitlesLoading } = useSubtitles(video);
  const [mediaError, setMediaError] = useState<string>();

  const {
    srcType: videoSourceType,
    thumbnail: videoThumbnail,
    id: videoId,
    userMeta,
  } = video;
  const loading = videoLoading || subtitlesLoading;

  const onTriggerWatchtimeEvent = () => {
    if (
      !playerRef?.current
      || !token
      || [0, -1].indexOf(playerRef.current.duration) > -1
    ) return;
    statsService.updateSync({
      videoId,
      watchedSeconds: playerRef.current.currentTime,
      watchedPercent:
        playerRef.current.currentTime / playerRef.current.duration,
    });
  };

  const keyboardListener = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!playerRef?.current) return;
    const player = playerRef?.current;

    // Play / Pause the video
    if (event.key === 'k' || event.key === ' ') {
      if (player?.paused) {
        player?.play();
      } else {
        player?.pause();
      }
    }

    // Mute the video
    if (event.key === 'm') {
      player.muted = !player?.muted;
    }

    // enter / exit fullscreen
    if (event.key === 'f') {
      if (player?.isFullscreenActive) {
        player?.exitFullscreen();
      } else {
        player?.enterFullscreen();
      }
    }

    // Volume up
    if (event.key === 'ArrowUp') {
      const vol = player?.volume;
      let nextVol = vol + PLAYER_VOLUME_UP_STEP;
      if (nextVol > 100) nextVol = 100;
      player.volume = nextVol;
    }

    // Volume down
    if (event.key === 'ArrowDown') {
      const vol = player?.volume;
      let nextVol = vol - PLAYER_VOLUME_DOWN_STEP;
      if (nextVol < 0) nextVol = 0;
      player.volume = nextVol;
    }

    // Move forward
    if (event.key === 'ArrowLeft') {
      const time = player.currentTime;
      let nextTime = time - PLAYER_MOVE_BACKWARD_STEP;
      if (nextTime < 0) nextTime = 0;
      player.currentTime = nextTime;
    }

    // Move backwark
    if (event.key === 'ArrowRight') {
      const time = player.currentTime;
      let nextTime = time + PLAYER_MOVE_FORWARD_STEP;
      if (nextTime > player.duration) nextTime = player.duration;
      player.currentTime = nextTime;
    }

    // toggle captions
    if (event.key === 'c') {
      if (player.isTextTrackVisible) {
        player.setTextTrackVisibility(false);
      } else {
        player.setTextTrackVisibility(true);
      }
    }

    // toggle captions
    if (event.key === 'p') {
      if (player.isPiPActive) {
        player.exitPiP();
      } else {
        player.enterPiP();
      }
    }
  };

  const onPlaybackStart = () => {
    if (playerRef?.current && userMeta?.watchedSeconds) playerRef.current.currentTime = userMeta.watchedSeconds;
  };

  useEffect(onTriggerWatchtimeEvent, [
    playerRef,
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
  }, [statsService])

  return (
    <div
      ref={hostRef}
      onKeyDown={keyboardListener}
      tabIndex={0}
      style={{ position: 'relative', paddingTop: '56.25%' }}
    >
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
          {!subtitlesLoading && subtitles && (
            <Provider
              rawVideoSource={streamUrl ?? ''}
              videoSourceType={videoSourceType}
              videoSubtitles={subtitles}
            />
          )}
          <Ui className="absolute h-screen w-full bg-red-600 top-0 left-0 border-none">
            <DblClickFullscreen />
            {/* Remove captions as they were creating double subtitles, so not needed */}
            {/* <Captions /> */}
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

type ProviderProps = {
  rawVideoSource: string
  videoSubtitles: Subtitle[]
  videoSourceType: VideoSource
}

/**
 * Depending on the video source we extend the proper video player
 * @param videoUrl
 * @param videoSubtitles
 * @constructor
 */
const Provider: React.FC<ProviderProps> = ({
  videoSubtitles,
  videoSourceType,
  rawVideoSource: streamUrl,
}) => {
  const tracks = getTracks(videoSubtitles ?? []);

  switch (videoSourceType) {
    case VideoSource.YOUTUBE:
      return <Youtube videoId={streamUrl} cookies={false} />;
    case VideoSource.INTERNAL:
      return (
        <VideoVime crossOrigin="use-credentials">
          <source data-src={streamUrl} type="video/mp4" />
          {tracks.map((track, i) => (
            <track {...track} key={i} />
          ))}
        </VideoVime>
      );
    case VideoSource.UNKNOWN:
      return (
        <VideoVime crossOrigin="use-credentials">
          <source data-src={streamUrl} type="video/mp4" />
        </VideoVime>
      );
  }
};

/**
 * Format tracks in order to be imported properly
 * @param videoSubtitles
 */
function getTracks(videoSubtitles: Subtitle[]) {
  const tracks: Track[] = [];
  for (const subtitle of videoSubtitles) {
    tracks.push({
      kind: 'subtitles',
      label: subtitle.lang,
      srcLang: subtitle.lang,
      src: subtitle.vttUrl,
      default: tracks.length === 0, // 1st is default
    });
  }
  return tracks;
}
