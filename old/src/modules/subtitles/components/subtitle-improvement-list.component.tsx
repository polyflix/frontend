import { useInjection } from "@polyflix/di";
import { Block } from "@polyflix/vtt-parser";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { WithClassname, RootState } from "../../common";
import { Alert, GhostList } from "../../ui";
import { Subtitle, Video } from "../../videos";
import { SubtitleImprovement } from "../models/subtitle-improvement.model";
import {
  UpdateListInProgress,
  UpdateListSuccess,
  UpdateListFailure,
} from "../redux/actions/subtitle-improvement.action";
import { SubtitleImprovementService } from "../services/subtitle-improvement.service";
import { SubtitleImprovementStatus } from "../types/subtitle-improvement.type";
import { SubtitleImprovementItem } from "./subtitle-improvement-item.component";

type SubtitleImprovementListProps = WithClassname & {
  block: Block;
  video: Video;
  subtitle: Subtitle;
};

export const SubtitleImprovementList: React.FC<SubtitleImprovementListProps> =
  ({ block, video, subtitle }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const subtitleImprovementService = useInjection<SubtitleImprovementService>(
      SubtitleImprovementService
    );

    useEffect(() => {
      dispatch(UpdateListInProgress(block.startTime));
      subtitleImprovementService
        .findAll({
          subtitleId: subtitle.id,
          timestamp: block.startTime,
          status: SubtitleImprovementStatus.WAITING_REVIEW,
        })
        .then((list) => {
          dispatch(UpdateListSuccess(block.startTime, list));
        })
        .catch(() => dispatch(UpdateListFailure(block.startTime)));
    }, [block.startTime, dispatch, subtitle.id, subtitleImprovementService]);

    const subtitleImprovementsList = useSelector((state: RootState) =>
      state.subtitleImprovement
        .find((e) => e.timestamp === block.startTime)
        ?.list?.sort((a, b) => b.likes - a.likes)
    );

    const isListLoading = useSelector(
      (state: RootState) =>
        state.subtitleImprovement.find((e) => e.timestamp === block.startTime)
          ?.isLoading
    );

    const isListError = useSelector(
      (state: RootState) =>
        state.subtitleImprovement.find((e) => e.timestamp === block.startTime)
          ?.isError
    );

    return !isListError && !isListLoading ? (
      <div className="w-full flex flex-col gap-8 mb-8">
        {subtitleImprovementsList?.map(
          (subtitleImprovement: SubtitleImprovement, i: number) => (
            <SubtitleImprovementItem
              key={i}
              subtitleImprovement={subtitleImprovement}
              block={block}
              video={video}
            />
          )
        )}
      </div>
    ) : !isListError ? (
      <GhostList count={3} className="gap-4 mb-4" />
    ) : (
      <Alert type="error" className="col-span-2">
        {t("shared.common.errors.common")}
      </Alert>
    );
  };
