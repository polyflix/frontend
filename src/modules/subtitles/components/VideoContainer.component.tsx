import React, { useEffect, useRef } from "react";
import { WithClassname, cn } from "../../common";
import { Alert, GhostTile } from "../../ui";
import { Player } from "../../videos/components/Player/Player.component";
import { useVideo } from "../../videos/hooks/useVideo.hook";

type VideoContainerProps = WithClassname & {
  onLoad: (elm: any) => void;
  slug: string;
  style?: React.CSSProperties;
};

export const VideoContainer: React.FC<VideoContainerProps> = ({
  onLoad,
  slug,
  className = "",
  style,
}) => {
  const { data: video, isLoading: isVideoLoading, alert } = useVideo(slug);
  const playerRef = useRef<HTMLVmPlayerElement>(null);

  useEffect(() => {
    if (video)
      onLoad({
        playerRef,
        video,
      });
  }, [video, onLoad]);

  return (
    <div className={cn(className, "flex-auto rounded-lg")} style={style}>
      {!isVideoLoading && video ? (
        <Player playerRef={playerRef} onVideoEnd={() => {}} video={video} />
      ) : !alert ? (
        <GhostTile aspectRatio={true} />
      ) : (
        <Alert type={alert.type} className="col-span-2">
          {alert.message}
        </Alert>
      )}
    </div>
  );
};
