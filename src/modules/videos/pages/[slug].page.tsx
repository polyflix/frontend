import React from "react";
import { Redirect, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { useVideos } from "../hooks/useVideos.hook";
import { Link } from "react-router-dom";
import { Url } from "../../common/utils/url.util";
import { Video } from "../models/video.model";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";

import {
  Playlist,
  Subtitle,
  Paragraph,
  Typography,
  OutlineButton,
} from "../../ui";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { MediaPlayer } from "../components/MediaPlayer/MediaPlayer.component";
import { VideoGhost } from "../components/VideoGhost/VideoGhost.component";
import { SubtitleText, Tab, TabGroup } from "../components/SubtitlesTabs";
import styles from "../../common/styles/ghost.module.scss";
import { Player } from "../../videos/components/Player/Player.component";
import { SubtitleLanguages } from "../models";
import { PencilIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { RootState } from "../../common";

export const VideoDetail: React.FC = () => {
  const { t } = useTranslation();

  const isPlayingMode = Boolean(Url.hasParameter("play")) === true;

  const { slug } = useParams<{ slug: string }>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const {
    data: video,
    isLoading,
    alert,
  } = useVideos<Video>({
    mode: "document",
    slug,
  });

  const ghosts = new Array(5).fill(null);

  const buildContent = (_video: Video) => {
    document?.getElementById("dsefault-tab")?.click();
    const subtitles = _video.getSubtitles(SubtitleLanguages.FR);
    const blocks = subtitles?.getBlocks();
    return isPlayingMode ? (
      <MediaPlayer video={_video} />
    ) : (
      <Container mxAuto fluid className={styles.root}>
        {video && (
          <section>
            <Player
              videoId={video.id}
              userMeta={video.userMeta}
              videoUrl={video.src}
              videoSubtitles={video.subtitles}
            />
            <div className="flex justify-between flex-wrap mt-2">
              <Typography as="h4" className="text-xl pl-3" bold>
                {video.title}
              </Typography>
              {user?.id === video.publisher?.id && (
                <Link to={video.getEditLink()}>
                  <OutlineButton as={"button"} className={"flex"}>
                    <PencilIcon className="w-4 md:w-5 mr-2 text-nx-red" />
                    {t("shared.common.actions.edit")}
                  </OutlineButton>
                </Link>
              )}
            </div>
          </section>
        )}
        <aside>
          <TabGroup>
            <Tab
              title={t("video.view.tabs.label.playlist")}
              icon={<Playlist />}
            >
              <Paragraph className="my-1">
                {t("video.view.publishedBy")}
                <Link
                  to={`/profile/videos/${video?.publisher?.id}`}
                  className="text-nx-red font-bold"
                >
                  {` ${video?.publisher?.displayName}`}
                </Link>
              </Paragraph>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
              illo voluptatum sint inventore quas aperiam animi incidunt
              similique laudantium, et aliquam blanditiis numquam veniam eos
              alias ipsum voluptatibus obcaecati deleniti.
            </Tab>
            {blocks && (
              <Tab
                title={t("video.view.tabs.label.subtitle")}
                icon={<Subtitle />}
              >
                {blocks.map((block) => {
                  return <SubtitleText block={block} key={block.sequence} />;
                })}
                )
              </Tab>
            )}
          </TabGroup>
          <div className={styles.suggestion_list}>
            {ghosts.map((_, i: number) => (
              <VideoGhost key={i} />
            ))}
          </div>
        </aside>
      </Container>
    );
  };

  if (alert) return <Redirect to="/not-found" />;
  return (
    <Page
      withNavbar={isPlayingMode ? false : true}
      variants={fadeOpacity}
      isLoading={isLoading}
      title={video?.title}
    >
      {video && buildContent(video)}
    </Page>
  );
};
