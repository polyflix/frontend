import { usePlayerContext } from "@vime/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { cn, WithClassname } from "../../common";
import {
  Alert,
  AlertType,
  Container,
  GhostList,
  GhostTile,
  Page,
  Spinner,
  Textarea,
  Typography,
} from "../../ui";
import { Subtitle, SubtitleLanguages, Video } from "../../videos";
import { Player } from "../../videos/components/Player/Player.component";
import { useVideo } from "../../videos/hooks/useVideo.hook";
import { Block } from "@polyflix/vtt-parser";
import { PencilIcon } from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { SubtitleImprovementService } from "../services/subtitle-improvement.service";
import { useForm } from "react-hook-form";
import { ISubtitleImprovementForm } from "../types/subtitle-improvement.type";
import { GhostParagraph } from "../../ui/components/Ghost/GhostParagraph";
import { SubtitleImprovement } from "../models/subtitle-improvement.model";

export const CollaborativeSubtitleEditingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [playerRef, setPlayerRef] =
    useState<React.RefObject<HTMLVmPlayerElement>>();
  const [video, setVideo] = useState<Video>();
  const [error, setError] = useState();

  const onVideoLoad = (event: any) => {
    setPlayerRef(event.playerRef);
    setVideo(event.video);
  };

  return (
    <Page
      className="h-full flex items-start justify-center"
      title={`${
        slug ? t("shared.common.actions.edit") : t("shared.common.actions.add")
      } ${t("videoManagement.video")}`}
    >
      <Container mxAuto fluid className="flex flex-col p-4 box-border">
        <Typography as="h1" className="text-2xl">
          {video?.title}
        </Typography>
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
          onError={setError}
          style={{ height: "min-content" }}
        />
        <SubtitleEditor
          className="w-full lg:w-7/12"
          video={video}
          playerRef={playerRef}
        />
      </Container>
    </Page>
  );
};

type VideoContainerProps = WithClassname & {
  onLoad: (elm: any) => void;
  onError: (error: any) => void;
  slug: string;
  style?: React.CSSProperties;
};

const VideoContainer: React.FC<VideoContainerProps> = ({
  onLoad,
  onError,
  slug,
  className = "",
  style,
}) => {
  const { data: video, isLoading: isVideoLoading, alert } = useVideo(slug);
  const playerRef = useRef<HTMLVmPlayerElement>(null);

  useEffect(() => {
    onError(alert);
    if (video)
      onLoad({
        playerRef,
        video,
      });
  }, [video, onLoad, onError, alert]);

  return (
    <div className={cn(className, "flex-auto rounded-lg")} style={style}>
      {!isVideoLoading && video ? (
        <Player
          videoId={video.id}
          videoSourceType={video.srcType}
          videoSubtitles={video.subtitles}
          playerRef={playerRef}
          onVideoEnd={() => {}}
          rawVideoSource={video.srcRaw}
          videoThumbnail={video.thumbnail}
        />
      ) : (
        <GhostTile aspectRatio={true} />
      )}
    </div>
  );
};

type SubtitleEditorProps = WithClassname & {
  video: Video | undefined;
  playerRef: React.RefObject<HTMLVmPlayerElement> | undefined;
};

const SubtitleEditor: React.FC<SubtitleEditorProps> = ({
  video,
  playerRef,
  className = "",
}) => {
  const subtitle = video?.getSubtitles(SubtitleLanguages.FR);
  const blocks = subtitle?.getBlocks();

  return playerRef ? (
    <div
      className={cn(
        className,
        "lg:ml-4 flex flex-col gap-2 pt-4 lg:p-2 box-border"
      )}
    >
      {subtitle &&
        blocks?.map((block: Block, i: number) => (
          <SubtitleBlock
            subtitle={subtitle}
            block={block}
            playerRef={playerRef}
            key={i}
          />
        ))}
    </div>
  ) : (
    <div
      className={cn(
        className,
        "lg:ml-4 flex flex-col gap-2 pt-4 lg:p-2 box-border justify-between h-full"
      )}
    >
      {new Array(3).fill(0).map((_, i: number) => (
        <GhostList count={1} key={i} />
      ))}
    </div>
  );
};

type SubtitleBlockProps = WithClassname & {
  playerRef: React.RefObject<HTMLVmPlayerElement>;
  block: Block;
  subtitle: Subtitle;
};

const SubtitleBlock: React.FC<SubtitleBlockProps> = ({
  playerRef,
  className = "",
  block,
  subtitle,
}) => {
  const [isFromOpen, setIsFromOpen] = useState(false);

  const [currentTime, setCurrentTime] = usePlayerContext(
    playerRef,
    "currentTime",
    0
  );

  const goToMilis = (millis: number): void => {
    const player: HTMLVmPlayerElement | null = playerRef.current;

    if (!player?.playing) {
      player?.play().then(() => {
        player.currentTime = millis / 1000;
      });
    } else {
      setCurrentTime(millis / 1000);
    }
  };

  const formatMilis = (milis: number): string => {
    const minutes = Math.round(milis / 1000 / 60);
    const secondes = Math.round((milis / 1000) % 60);

    const parsedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const parsedSeconds = secondes < 10 ? `0${secondes}` : `${secondes}`;

    return `${parsedMinutes}:${parsedSeconds}`;
  };

  const isCurrent = (block: Block): boolean => {
    return (
      block.startTime / 1000 <= currentTime &&
      block.endTime / 1000 > currentTime
    );
  };

  return (
    <>
      <div
        className={cn(className, "flex flex-row items-center justify-start")}
      >
        <span
          onClick={() => setIsFromOpen(!isFromOpen)}
          className={cn(
            "w-5 h-5 mr-2 text-nx-red hover:hidden cursor-pointer",
            !isCurrent(block) && !isFromOpen && "text-opacity-50",
            "hover:text-opacity-100"
          )}
        >
          <PencilIcon />
        </span>
        <div
          className={cn(
            "flex flex-row box-border items-center justify-start group cursor-pointer pt-2 pb-2 w-full",
            isCurrent(block) &&
              "border-l-2 border-nx-red pl-0 relative bg-gray-800 bg-opacity-30"
          )}
          onClick={() => goToMilis(block.startTime)}
        >
          <Typography as="span" className="ml-2 mr-4 w-14 lg:block">
            {formatMilis(block.startTime)}
          </Typography>
          <Typography as="p" className="group-hover:text-nx-red">
            {block.text}
          </Typography>
        </div>
      </div>
      {isFromOpen && <SubtitleBlockForm subtitle={subtitle} block={block} />}
    </>
  );
};

type SubtitleBlockFormProps = {
  block: Block;
  subtitle: Subtitle;
  subtitleImportant?: SubtitleImprovement;
};

const SubtitleBlockForm: React.FC<SubtitleBlockFormProps> = ({
  block,
  subtitle,
  subtitleImportant,
}) => {
  const isUpdate = !!subtitleImportant?.id;

  const subtitleImprovementService = useInjection<SubtitleImprovementService>(
    SubtitleImprovementService
  );

  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { register, handleSubmit, errors, watch, setValue } =
    useForm<ISubtitleImprovementForm>({
      defaultValues: {
        id: undefined,
        subtitleId: subtitle.id,
        comment: isUpdate ? subtitleImportant?.comment : block.text,
      },
    });

  const onSubmit = async (data: ISubtitleImprovementForm) => {
    const values: ISubtitleImprovementForm = {
      ...data,
      id: subtitleImportant?.id as string,
      subtitleId: subtitle.id,
    };

    setLoading(true);
    setIsSubmit(true);
    try {
      await (isUpdate
        ? subtitleImprovementService.update(values)
        : subtitleImprovementService.create(values));

      setAlert({
        message: isUpdate
          ? `${t("subtitleImprovement.form.success", {
              action: `${t("shared.form.update")}`,
            })}.`
          : `${t("subtitleImprovement.form.success", {
              action: `${t("shared.form.create")}`,
            })}.`,
        type: "success",
      });
    } catch (err) {
      setAlert({
        message: `${t("subtitleImprovement.form.error")}`,
        type: "error",
      });
    } finally {
      setLoading(false);
      setIsSubmit(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="col-span-2 flex items-center gap-2">
          <Spinner
            className="fill-current text-nx-red"
            style={{
              color: "white",
            }}
          ></Spinner>
          <Typography as="span" className="text-sm ml-2">
            {t("shared.common.wait")}..
          </Typography>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4 rounded p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Textarea
            name="comment"
            error={errors.comment}
            className="col-span-2 md:col-span-1"
            placeholder={t("subtitleImprovement.fields.comment")}
            required
            ref={register({
              required: {
                value: true,
                message: `${t("shared.form.error.required")}.`,
              },
            })}
          />
          <button
            type="submit"
            disabled={isSubmit}
            className={cn(
              "col-span-2 bg-nx-red transition-colors hover:bg-nx-red-dark text-white cursor-pointer py-2 px-2 rounded-md font-bold focus:outline-none",
              isSubmit && "bg-nx-dark bg-opacity-40 cursor-not-allowed"
            )}
          >
            {isUpdate
              ? t("shared.form.action", {
                  action: `${t("shared.form.update")}`,
                })
              : t("shared.form.action", {
                  action: `${t("shared.form.create")}`,
                })}
          </button>
          {alert && (
            <Alert type={alert.type} className="col-span-2">
              {alert.message}
            </Alert>
          )}
        </form>
      )}
    </>
  );
};
