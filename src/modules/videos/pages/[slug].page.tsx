import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Url } from "../../common/utils/url.util";
import { fadeInDown } from "../../ui/animations/fadeInDown";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { stagger } from "../../ui/animations/stagger";
import { PlayButton } from "../../ui/components/Buttons/PlayButton/PlayButton.component";
import { Container } from "../../ui/components/Container/Container.component";
import { Image } from "../../ui/components/Image/Image.component";
import { Page } from "../../ui/components/Page/Page.component";
import { Paragraph } from "../../ui/components/Typography/Paragraph/Paragraph.component";
import { Title } from "../../ui/components/Typography/Title/Title.component";
import { MediaPlayer } from "../components/MediaPlayer/MediaPlayer.component";
import { useVideos } from "../hooks/useVideos.hook";
import { Video } from "../models/video.model";

export const VideoDetail: React.FC = () => {
  const { t } = useTranslation();

  const isPlayingMode = Boolean(Url.hasParameter("play")) === true;

  const { slug } = useParams<{ slug: string }>();

  const { data: video, isLoading, alert } = useVideos<Video>({
    mode: "document",
    slug,
  });

  const buildContent = (_video: Video) => {
    return isPlayingMode ? (
      <MediaPlayer video={_video} />
    ) : (
      <Container mxAuto>
        <motion.article variants={stagger(0.1)} className="py-5">
          <Image
            variants={fadeInDown}
            className="h-56"
            alt={`${video?.title} thumbnail`}
            src={_video.thumbnail}
          />
          <Title variants={fadeInDown}>{_video.title}</Title>
          <Paragraph variants={fadeInDown} className="my-4">
            {t("videoDetails.publishedBy")}{" "}
            <Link className="font-bold" to={`/profile/${_video.publisher?.id}`}>
              {_video.publisher?.displayName}
            </Link>
          </Paragraph>
          <Paragraph className="my-4" variants={fadeInDown}>
            {_video.description}
          </Paragraph>
          {video && <PlayButton playLink={_video.getStreamLink()} />}
        </motion.article>
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
