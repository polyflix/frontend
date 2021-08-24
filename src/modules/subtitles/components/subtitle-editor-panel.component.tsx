import { useInjection } from "@polyflix/di";
import { VttFile, Block } from "@polyflix/vtt-parser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { WithClassname, cn } from "../../common";
import { PolyflixLanguage } from "../../common/types/language.type";
import { Alert, GhostText } from "../../ui";
import { MinioService } from "../../upload/services/minio.service";
import { Subtitle, Video } from "../../videos";
import { SubtitleService } from "../../videos/services";
import { SubtitleFetchingState } from "../pages/collaborative-subtitle-editing.page";
import { SetBlockSuccess } from "../redux/actions/subtitle-improvement.action";
import { SubtitleBlock } from "./subtitle-block.component";

type SubtitleEditorPanelProps = WithClassname & {
  video: Video | undefined;
  playerRef: React.RefObject<HTMLVmPlayerElement> | undefined;
};

export const SubtitleEditorPanel: React.FC<SubtitleEditorPanelProps> = ({
  video,
  playerRef,
  className = "",
}) => {
  const { i18n, t } = useTranslation();
  const [subtitles, setSubtitles] = useState<SubtitleFetchingState>();
  const minioService = useInjection<MinioService>(MinioService);
  const subtitleService = useInjection<SubtitleService>(SubtitleService);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!video) return;
    const language = video.selectProperLanguage(
      i18n.language as PolyflixLanguage
    );
    if (!language) return;
    setSubtitles({
      state: "loading",
    });
    subtitleService
      .getSubtitleUrlByVideoId(video?.id)
      .then((s: Subtitle[]) => s)
      .then((s: Subtitle[]) =>
        minioService
          .getSubtitlePresignedUrl(video.id, language)
          .then(async ({ tokenAccess }) => {
            const subtitles = new Subtitle(
              language,
              tokenAccess,
              await VttFile.fromUrl(tokenAccess),
              s[0].id
            );
            setSubtitles({
              state: "succeed",
              subtitle: subtitles,
              blocks: subtitles.getBlocks(),
            });
            subtitles
              .getBlocks()
              ?.map((block) =>
                dispatch(SetBlockSuccess(block.startTime, block.text))
              );
          })
          .catch((_) => {
            setSubtitles({
              state: "error",
            });
          })
      )
      .catch((_) => {
        setSubtitles({
          state: "error",
        });
      });
  }, [dispatch, i18n, minioService, subtitleService, video]);

  const blocks = subtitles?.blocks;

  return playerRef && subtitles && blocks ? (
    <div
      className={cn(
        className,
        "lg:ml-4 flex flex-col gap-2 pt-4 lg:p-2 box-border"
      )}
    >
      {video && blocks.length > 0 ? (
        blocks?.map((block: Block, i: number) => (
          <SubtitleBlock
            subtitles={subtitles}
            block={block}
            playerRef={playerRef}
            key={i}
            video={video}
          />
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Alert type="not-found" className="col-span-2">
            {t("shared.common.errors.noData")}
          </Alert>
        </div>
      )}
    </div>
  ) : subtitles?.state === "loading" ? (
    <div
      className={cn(
        className,
        "lg:ml-4 flex flex-col gap-6 pt-4 lg:p-2 box-border justify-between h-full"
      )}
    >
      {new Array(5).fill(0).map((_, i: number) => (
        <div className="flex gap-4 items-center" key={i}>
          <GhostText className="w-12" />
          <GhostText className="w-full" />
        </div>
      ))}
    </div>
  ) : (
    <Alert type="not-found" className="w-1/3">
      {t("shared.common.errors.common")}
    </Alert>
  );
};
