import {
  ChevronRightIcon,
  ExclamationIcon,
  EyeIcon,
  PencilIcon,
  ThumbUpIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { Block, VttFile } from "@polyflix/vtt-parser";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useMediaQuery } from "react-responsive";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../authentication";
import { CollectionSlider } from "../../collections/components/CollectionSlider/CollectionSlider.component";
import { useCollections } from "../../collections/hooks";
import { Collection } from "../../collections/models";
import { useQuery } from "../../common/hooks/useQuery";
import { PolyflixLanguage } from "../../common/types/language.type";
import { cn } from "../../common/utils/classes.util";
import { WatchtimeSyncService } from "../../stats/services/watchtime-sync.service";
import { GhostList, Title, Typography } from "../../ui";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { Container } from "../../ui/components/Container/Container.component";
import { GhostParagraph } from "../../ui/components/Ghost/GhostParagraph";
import { GhostSlider } from "../../ui/components/Ghost/GhostSlider/GhostSlider.component";
import { GhostTile } from "../../ui/components/Ghost/GhostTile/GhostTile.component";
import { Page } from "../../ui/components/Page/Page.component";
import { MinioService } from "../../upload/services/minio.service";
import { Player } from "../../videos/components/Player/Player.component";
import { SubtitleText } from "../components";
import { VideoNote } from "../components/VideoNote/VideoNote.component";
import { useVideo } from "../hooks/useVideo.hook";
import { Subtitle } from "../models";
import { Video } from "../models/video.model";
import styles from "./slug.module.scss";

export const VideoDetail: React.FC = () => {
  const [pageTitle, setPageTitle] = useState<string>();
  const [videoSlug, setVideoSlug] = useState<string>();
  const [collectionLoaded, setCollectionLoaded] = useState<boolean>(false);
  const [error, setError] = useState();

  const query = useQuery() as URLSearchParams;

  useEffect(() => {
    if (query.has("v") && !collectionLoaded) {
      setVideoSlug(query.get("v") as string);
    }
  }, [query, collectionLoaded]);

  const onCollectionLoaded = (firstVideoSlug: string) => {
    if (query.has("index") && +(query.get("index") as string) === 0)
      setVideoSlug(firstVideoSlug);
    setCollectionLoaded(true);
  };

  const buildContent = () => {
    return (
      <Container mxAuto fluid className="p-4 pb-8">
        {videoSlug && (!query.has("c") || collectionLoaded) && (
          <VideoContainer
            onLoad={setPageTitle}
            onError={setError}
            slug={videoSlug}
          />
        )}
        {query.has("c") && (
          <CollectionComponent
            onLoad={onCollectionLoaded}
            slug={query.get("c") as string}
          />
        )}
      </Container>
    );
  };

  if (error) return <Redirect to="/not-found" />;
  return (
    <Page variants={fadeOpacity} title={pageTitle}>
      {buildContent()}
    </Page>
  );
};

type VideoContainerProps = {
  onLoad: (elm: string) => void;
  onError: (error: any) => void;
  slug: string;
};

export type SubtitleFetchingState = {
  state: "loading" | "error" | "idle" | "succeed";
  subtitle?: Subtitle;
  blocks?: Block[];
};

const VideoContainer: React.FC<VideoContainerProps> = ({
  onLoad,
  onError,
  slug,
}) => {
  const { data: video, isLoading: isVideoLoading, alert } = useVideo(slug);

  const isLtMdScreen = useMediaQuery({ query: "(max-width: 767px)" });

  const playerRef = useRef<HTMLVmPlayerElement>(null);

  const onVideoEnd = () => {
    // TODO: For when the reader is less buggy
  };

  useEffect(() => {
    onError(alert);
    if (video) onLoad(video?.title);
  }, [video, onLoad, onError, alert]);
  return (
    <>
      <div
        className={cn(
          "flex flex-col md:flex-row gap-4 mb-8",
          isLtMdScreen ? styles.container_mobile : styles.container_desktop
        )}
      >
        <div className={cn("flex-auto rounded-md")}>
          {!isVideoLoading && video ? (
            <Player
              video={video}
              playerRef={playerRef}
              onVideoEnd={onVideoEnd}
            />
          ) : (
            <GhostTile aspectRatio={true} />
          )}
        </div>
        <SidebarComponent video={video} playerRef={playerRef} />
      </div>
      <Title className="text-4xl">{video?.title}</Title>
      {video?.description && (
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl font-bold text-nx-red" {...props}>
                {}
              </h1>
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-semibold" {...props}>
                {}
              </h2>
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-semibold" {...props}>
                {}
              </h3>
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-lg font-semibold" {...props}>
                {}
              </h4>
            ),
            h5: ({ node, ...props }) => (
              <h5 className="text-md font-semibold" {...props}>
                {}
              </h5>
            ),
            h6: ({ node, ...props }) => (
              <h6 className="font-semibold" {...props}>
                {}
              </h6>
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-500 underline" {...props}>
                {}
              </a>
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside" {...props}>
                {}
              </ul>
            ),
            pre: ({ node, ...props }) => (
              <pre
                className="rounded-lg bg-gray-100 bg-opacity-5 p-4"
                {...props}
              >
                {}
              </pre>
            ),
          }}
          className=" py-4 md:pr-1 text-opacity-90 text-white"
        >
          {video.description}
        </ReactMarkdown>
      )}
    </>
  );
};

type SidebarComponentProps = {
  video?: Video;
  playerRef: React.RefObject<HTMLVmPlayerElement>;
};

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  video,
  playerRef,
}) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const watchtimeSyncService =
    useInjection<WatchtimeSyncService>(WatchtimeSyncService);

  const [isContainerDataVisible, setContainerDataIsVisible] = useState(true);
  const [visiblePanelElement, setVisiblePanelElement] = useState("description");
  const [isLiked, setLiked] = useState<boolean | undefined>(undefined);
  const [subtitles, setSubtitles] = useState<SubtitleFetchingState>();
  const minioService = useInjection<MinioService>(MinioService);

  useEffect(() => {
    if (!video) return;
    const language = video.selectProperLanguage(
      i18n.language as PolyflixLanguage
    );
    if (
      !language ||
      (subtitles && subtitles.subtitle?.lang === language) ||
      ["loading", "error"].indexOf(subtitles?.state ?? "") > -1
    )
      return;
    setSubtitles({
      state: "loading",
    });
    minioService
      .getSubtitlePresignedUrl(video.id, language)
      .then(async ({ tokenAccess }) => {
        const subtitles = new Subtitle(
          language,
          tokenAccess,
          await VttFile.fromUrl(tokenAccess)
        );
        setSubtitles({
          state: "succeed",
          subtitle: subtitles,
          blocks: subtitles.getBlocks(),
        });
      })
      .catch((_) => {
        setSubtitles({
          state: "error",
        });
      });
  }, [i18n.language, minioService, subtitles, video]);

  const isLtMdScreen = useMediaQuery({ query: "(max-width: 767px)" });
  const isXlScreen = useMediaQuery({ query: "(min-width: 1280px)" });

  const calcDataContainerWidth = (): string => {
    return isContainerDataVisible ? (isXlScreen ? "580px" : "400px") : "36px";
  };

  const like = () => {
    if (video) {
      watchtimeSyncService.likeVideo(video.id);
      if (!isLiked) {
        video.likes += 1;
      } else {
        video.likes -= 1;
      }
      setLiked(!isLiked);
    }
  };

  if (video && isLiked === undefined) {
    setLiked(video?.userMeta ? video?.userMeta.isLiked : false);
  }
  return (
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
              {video ? (
                <>
                  <div className="flex flex-col md:pr-4 w-full">
                    <div className="py-2 flex items-center text-sm sticky top-0 bg-black bg-opacity-90 z-10">
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
                      {!isLtMdScreen && isContainerDataVisible && (
                        <ul className="flex mb-1 list-none flex-wrap pb-1 flex-row">
                          {/* <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                              className={cn(
                                "flex rounded-lg font-bold uppercase px-5 py-3 cursor-pointer",
                                visiblePanelElement === "description"
                                  ? "text-white bg-red-600"
                                  : "text-red-600 bg-black",
                                "hover:bg-red-600 hover:text-white"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                setVisiblePanelElement("description");
                              }}
                              href="#description"
                            >
                              <InformationCircleIcon className="w-4 md:w-5" />
                              <Typography as="p" className="text-sm ml-2">
                                {t("video.view.label.description")}
                              </Typography>
                            </a>
                            <span className="flex-1"></span>
                          </li> */}
                          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                              className={cn(
                                "flex rounded-lg font-bold uppercase px-5 py-3 cursor-pointer",
                                visiblePanelElement === "subtitle"
                                  ? "text-white bg-red-600"
                                  : "text-red-600 bg-black",
                                "hover:bg-red-600 hover:text-white"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                setVisiblePanelElement("subtitle");
                              }}
                              href="#subtitle"
                            >
                              <TranslateIcon className="w-4 md:w-5" />
                              <Typography as="p" className="text-sm ml-2">
                                {t("video.view.label.subtitle")}
                              </Typography>
                            </a>
                          </li>
                          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                              className={cn(
                                "flex rounded-lg font-bold uppercase px-5 py-3 cursor-pointer",
                                visiblePanelElement === "note"
                                  ? "text-white bg-red-600"
                                  : "text-red-600 bg-black",
                                "hover:bg-red-600 hover:text-white"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                setVisiblePanelElement("note");
                              }}
                              href="#note"
                            >
                              <PencilIcon className="w-4 md:w-5 " />
                              <Typography as="p" className="text-sm ml-2">
                                {t("video.view.label.note")}
                              </Typography>
                            </a>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div
                      className="relative z-0"
                      style={{ paddingBottom: "70px" }}
                    >
                      {!isLtMdScreen ? (
                        isContainerDataVisible &&
                        ((visiblePanelElement === "subtitle" && (
                          <div>
                            {subtitles && subtitles.blocks && (
                              <Link to={`/subtitle-editing/${video.slug}`}>
                                <PencilIcon className="w-4 md:w-5 mr-2 text-nx-red" />
                              </Link>
                            )}
                            {subtitles && subtitles.blocks ? (
                              subtitles.blocks.map((block) => {
                                return (
                                  <SubtitleText
                                    block={block}
                                    key={block.sequence}
                                    playerRef={playerRef}
                                  />
                                );
                              })
                            ) : (
                              <Typography
                                as="p"
                                className="text-center text-sm py-4 md:pr-1 flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-2/4 w-full"
                              >
                                <ExclamationIcon className="w-6 md:w-7 text-nx-red mr-2" />
                                {subtitles?.state === "loading" &&
                                  t("video.view.content.generatingSubtitles")}
                                {subtitles?.state === "error" &&
                                  t("video.view.content.subtitleError")}
                                {!subtitles?.state &&
                                  t("video.view.content.noSubtitle")}
                              </Typography>
                            )}
                          </div>
                        )) ||
                          (visiblePanelElement === "description" && (
                            <div className="pt-2">
                              {/* Volontary let description old code to facilitate future rewords on description and short resume. Issues opened */}
                              {/* <Typography as="h4" bold className="text-2xl">
                                {video?.title}
                              </Typography>
                              <Paragraph className="text-xs py-4 md:pr-1 ">
                                {video?.description}
                              </Paragraph> */}
                            </div>
                          )) ||
                          (visiblePanelElement === "note" && (
                            <div className="pt-2">
                              <VideoNote video={video}></VideoNote>
                            </div>
                          )))
                      ) : (
                        <>
                          {/* <Typography as="h4" bold className="text-2xl">
                            {video?.title}
                          </Typography>
                          <Paragraph className="text-xs py-4 md:pr-1 text-opacity-60">
                            {video?.description}
                          </Paragraph> */}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center pt-4 pr-4 w-full absolute bottom-0 bg-black">
                    {isContainerDataVisible && (
                      <>
                        <div
                          className="overflow-hidden"
                          style={{ minWidth: "50px" }}
                        >
                          <Typography
                            as="span"
                            overrideDefaultClasses
                            bold
                            className="flex items-center text-sm md:text-base"
                          >
                            <EyeIcon className="text-blue-500  w-5 mr-2" />{" "}
                            {video?.views}
                          </Typography>

                          <Typography
                            as="span"
                            overrideDefaultClasses
                            bold
                            className="flex items-center text-sm md:text-base"
                          >
                            <ThumbUpIcon
                              className={`${
                                isLiked ? "text-blue-500" : "text-grey-500"
                              } w-5 mr-2 cursor-pointer`}
                              onClick={() => like()}
                            />
                            {video?.likes}
                          </Typography>
                        </div>

                        <div className="flex items-center flex-1">
                          <img
                            className="cursor-pointer w-10 h-10 rounded-3xl mr-3"
                            src="https://picsum.photos/50"
                            alt="avatar"
                          />
                          <div className="overflow-hidden">
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
                        </div>
                        {video && user?.id === video?.publisher?.id && (
                          <Link to={video?.getEditLink()}>
                            <PencilIcon className="w-4 md:w-5 mr-2 text-nx-red" />
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-between h-full">
                  {" "}
                  <GhostParagraph count={5} />
                  <GhostList count={1} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type CollectionComponentProps = {
  onLoad: (elm: string) => void;
  slug: string;
};

const CollectionComponent: React.FC<CollectionComponentProps> = ({
  onLoad,
  slug,
}) => {
  let query = useQuery() as URLSearchParams;

  const { data: collection, isLoading: isCollectionLoading } =
    useCollections<Collection>({
      mode: "document",
      slug,
    });

  useEffect(() => {
    if (collection) onLoad(collection.videos[0].slug);
  }, [collection, onLoad]);

  return (
    <>
      {!isCollectionLoading ? (
        collection?.videos && (
          <CollectionSlider
            collection={collection}
            startIndex={+(query.get("index") || 0)}
          />
        )
      ) : (
        <GhostSlider count={5} />
      )}
    </>
  );
};
