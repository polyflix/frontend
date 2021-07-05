import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../authentication";
import { Url } from "../../common/utils/url.util";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";

import { GhostTile } from "../../ui/components/Ghost/GhostTile/GhostTile.component";
import { Paragraph, Typography } from "../../ui";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { Player } from "../../videos/components/Player/Player.component";
import { MediaPlayer } from "../components/MediaPlayer/MediaPlayer.component";
import styles from "./slug.module.scss";
import { cn } from "../../common/utils/classes.util";
import {
  PencilIcon,
  ChevronRightIcon,
  TranslateIcon,
  InformationCircleIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import { SubtitleText } from "../components/SubtitleText/SubtitleText";
import { useMediaQuery } from "react-responsive";
import { useVideo } from "../hooks/useVideo.hook";
import { SubtitleLanguages } from "../models";
import { Video } from "../models/video.model";
import { GhostSlider } from "../../ui/components/Ghost/GhostSlider.component";
import { useCollections } from "../../collections/hooks";
import { Collection } from "../../collections/models";
import { useQuery } from "../../common/hooks/useQuery";
import { CollectionSlider } from "../../collections/components/CollectionSlider/CollectionSlider.component";

export const VideoDetail: React.FC = () => {
  const isPlayingMode = Boolean(Url.hasParameter("play")) === true;

  const { slug } = useParams<{ slug: string }>();

  let query = useQuery();

  const { user } = useAuth();
  const { t } = useTranslation();

  const [isContainerDataVisible, setContainerDataIsVisible] = useState(true);

  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);

  const { data: video, isLoading: isVideoLoading, alert } = useVideo(slug);

  const isLtMdScreen = useMediaQuery({ query: "(max-width: 767px)" });
  const isXlScreen = useMediaQuery({ query: "(min-width: 1280px)" });

  const { data: collection, isLoading: isCollectionLoading } =
    useCollections<Collection>({
      mode: "document",
      slug: query.get("c") as string,
    });

  const calcDataContainerWidth = (): string => {
    return isContainerDataVisible ? (isXlScreen ? "580px" : "400px") : "36px";
  };

  const buildContent = (_video: Video) => {
    const subtitles = _video.getSubtitles(SubtitleLanguages.FR);
    const blocks = subtitles?.getBlocks();

    return isPlayingMode ? (
      <MediaPlayer video={_video} />
    ) : (
      <Container mxAuto fluid className="p-4 pb-8">
        <div
          className={cn(
            "flex flex-col md:flex-row gap-4 mb-8",
            isLtMdScreen ? styles.container_mobile : styles.container_desktop
          )}
        >
          <div className="flex-auto rounded-md">
            {video && (
              <Player
                videoId={video.id}
                userMeta={video.userMeta}
                videoUrl={video.src}
                videoSubtitles={video.subtitles}
              />
            )}
          </div>
          <div
            className={cn(styles.data_container)}
            style={{
              width: isLtMdScreen ? "100%" : calcDataContainerWidth(),
            }}
          >
            <div className={cn(styles.data_container__sub1)}>
              <div className={cn(styles.data_container__sub2)}>
                <div className={cn("md:min-h-0", styles.data_container__sub3)}>
                  <div
                    className={cn(
                      "text-white",
                      isLtMdScreen && "m-0",
                      styles.data_container__content
                    )}
                  >
                    <div className="flex flex-col md:pr-4 w-full">
                      <div className="py-2 flex items-center text-sm sticky top-0 bg-black bg-opacity-80 z-10">
                        {!isLtMdScreen && (
                          <ChevronRightIcon
                            className={cn(
                              "w-4 md:w-5 mr-2 text-nx-red cursor-pointer",
                              !isContainerDataVisible && "transform rotate-180"
                            )}
                            onClick={() =>
                              setContainerDataIsVisible(!isContainerDataVisible)
                            }
                          />
                        )}
                        {!isLtMdScreen &&
                          isContainerDataVisible &&
                          (isSubtitleVisible ? (
                            <button
                              className="flex border-2 border-red-600 rounded-lg px-2 py-1 text-nx-red cursor-pointer hover:bg-red-600 hover:text-white"
                              onClick={() => setIsSubtitleVisible(false)}
                            >
                              <InformationCircleIcon className="w-4 md:w-5" />
                              <Typography as="p" className="text-sm ml-2">
                                {t("video.view.label.description")}
                              </Typography>
                            </button>
                          ) : (
                            <button
                              className="flex border-2 border-red-600 rounded-lg px-2 py-1 text-nx-red cursor-pointer hover:bg-red-600 hover:text-white"
                              onClick={() => setIsSubtitleVisible(true)}
                            >
                              <TranslateIcon className="w-4 md:w-5" />
                              <Typography as="p" className="text-sm ml-2">
                                {t("video.view.label.subtitle")}
                              </Typography>
                            </button>
                          ))}
                      </div>
                      <div
                        className="relative z-0"
                        style={{ paddingBottom: "70px" }}
                      >
                        {!isLtMdScreen ? (
                          isContainerDataVisible &&
                          (isSubtitleVisible ? (
                            <div>
                              {blocks ? (
                                blocks.map((block) => {
                                  return (
                                    <SubtitleText
                                      block={block}
                                      key={block.sequence}
                                    />
                                  );
                                })
                              ) : (
                                <Typography
                                  as="p"
                                  className="text-center text-sm py-4 md:pr-1 flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-2/4 w-full"
                                >
                                  <ExclamationIcon className="w-6 md:w-7 text-nx-red mr-2" />

                                  {t("video.view.content.noSubtitle")}
                                </Typography>
                              )}
                            </div>
                          ) : (
                            <Paragraph className="text-sm py-4 md:pr-1">
                              {video?.description}
                            </Paragraph>
                          ))
                        ) : (
                          <Paragraph className="text-sm py-4 md:pr-1">
                            {video?.description}
                          </Paragraph>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center pt-4 pr-4 w-full absolute bottom-0 bg-black bg-opacity-80">
                      {isContainerDataVisible && (
                        <>
                          <img
                            className="cursor-pointer w-10 h-10 rounded-3xl mr-3"
                            src="https://picsum.photos/50"
                            alt="avatar"
                          />
                          <div className="flex-1 overflow-hidden">
                            <div>
                              <Link
                                to={`/profile/videos/${video?.publisher?.id}`}
                                className="font-bold text-red-300 cursor-pointer hover:underline"
                              >
                                {` ${video?.publisher?.displayName}`}
                              </Link>
                            </div>
                            <p className="text-white leading-normal">
                              {video?.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          {video && user?.id === video?.publisher?.id && (
                            <Link to={video?.getEditLink()}>
                              <PencilIcon className="w-4 md:w-5 mr-2 text-nx-red" />
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {collection?.videos && (
          <CollectionSlider
            collection={collection}
            startIndex={+(query.get("index") || 0)}
          />
        )}
      </Container>
    );
  };

  const buildGhost = () => {
    return (
      <Container mxAuto fluid className="p-4 pb-8">
        <div
          className={cn(
            "flex flex-col md:flex-row gap-4 mb-8",
            isLtMdScreen ? styles.container_mobile : styles.container_desktop
          )}
        >
          <div className="flex-auto rounded-md">
            <GhostTile aspectRatio={true} />
          </div>
          <div
            className={cn(styles.data_container, "flex")}
            style={{
              width: isLtMdScreen ? "100%" : calcDataContainerWidth(),
            }}
          >
            <GhostTile aspectRatio={false} className="h-full min-h-2" />
          </div>
        </div>
        <GhostSlider count={5} />
      </Container>
    );
  };

  if (alert) return <Redirect to="/not-found" />;
  return (
    <Page
      withNavbar={isPlayingMode ? false : true}
      variants={fadeOpacity}
      title={video?.title}
    >
      {!isVideoLoading && !isCollectionLoading && video
        ? buildContent(video)
        : buildGhost()}
    </Page>
  );
};
