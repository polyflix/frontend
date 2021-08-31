import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Container, Page } from "../../ui";
import { ISubtitle, Subtitle, Video } from "../../videos";
import { Block } from "@polyflix/vtt-parser";
import { VideoContainer } from "../components/VideoContainer.component";
import { SubtitleEditorPanel } from "../components/subtitle-editor-panel.component";
import { Jumbotron } from "../../ui/components/Jumbotron/Jumbotron.component";

export type SubtitleFetchingState = {
  state: 'loading' | 'error' | 'idle' | 'succeed'
  subtitle?: ISubtitle | Subtitle
  blocks?: Block[]
}

export const CollaborativeSubtitleEditingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [playerRef, setPlayerRef] = useState<React.RefObject<HTMLVmPlayerElement>>();
  const [video, setVideo] = useState<Video>();

  const onVideoLoad = (event: any) => {
    setPlayerRef(event.playerRef);
    setVideo(event.video);
  };

  return (
    <Page
      className="h-full flex items-start justify-center"
      title={`${
        slug ? t('shared.common.actions.edit') : t('shared.common.actions.add')
      } ${t('videoManagement.video')}`}
    >
      <Container mxAuto fluid className="flex flex-col p-4 box-border">
        <Jumbotron
          withGoBack
          content={t("subtitleImprovement.header.description")}
          title={video?.title || t("subtitleImprovement.header.title")}
        />
      </Container>
      <Container
        mxAuto
        fluid
        className="flex flex-col lg:flex-row p-4 box-border"
      >
        <VideoContainer
          className="lg:sticky lg:top-20"
          slug={slug}
          onLoad={onVideoLoad}
          style={{ height: 'min-content' }}
        />
        <SubtitleEditorPanel
          className="w-full lg:w-7/12"
          video={video}
          playerRef={playerRef}
        />
      </Container>
    </Page>
  );
};
