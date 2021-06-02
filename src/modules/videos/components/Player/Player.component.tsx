import React from "react";
import Plyr from "plyr-react";
import { SourceInfo, Options, Provider, Track } from "plyr";
import "plyr-react/dist/plyr.css";
import { Subtitle } from "../../models/subtitle.model";

type Props = {
  videoUrl: string;
  videoSubtitles: Subtitle[];
};

const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_VIMEO = /vimeo\.com\/.+/;

export const Player: React.FC<Props> = ({ videoUrl, videoSubtitles }) => {
  const provider = getProvider(videoUrl);
  let tracks = getTracks(videoSubtitles);

  const videoSrc: SourceInfo = {
    type: "video",
    sources: [
      {
        src: videoUrl,
        provider: provider,
      },
    ],
    tracks: tracks as Track[],
  };

  const videoOptions: Options = {};

  const playerStyle = {
    "--plyr-color-main": "red",
  } as React.CSSProperties;

  return <Plyr source={videoSrc} options={videoOptions} style={playerStyle} />;
};

function getTracks(videoSubtitles: Subtitle[]) {
  let tracks = [];
  for (const subtitle of videoSubtitles) {
    tracks.push({
      kind: "captions",
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
function getProvider(videoUrl: string) {
  let provider: Provider;
  if (MATCH_URL_YOUTUBE.test(videoUrl)) {
    provider = "youtube";
  } else if (MATCH_URL_VIMEO.test(videoUrl)) {
    provider = "vimeo";
  } else {
    provider = "html5";
  }
  return provider;
}
