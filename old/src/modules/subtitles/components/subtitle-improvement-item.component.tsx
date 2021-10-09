import { Menu, Transition } from "@headlessui/react";
import {
  PencilIcon,
  TrashIcon,
  ThumbUpIcon,
  CheckIcon,
  XIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { Block } from "@polyflix/vtt-parser";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../authentication";
import { WithClassname, RootState, cn } from "../../common";
import { Alert, Typography } from "../../ui";
import { Video } from "../../videos";
import { SubtitleImprovement } from "../models/subtitle-improvement.model";
import {
  UpdateElementInProgress,
  UpdateElementSuccess,
  UpdateElementFailure,
  DeleteElementInProgress,
  DeleteElementSuccess,
  DeleteElementFailure,
  SetBlockSuccess,
  UpdateFormElementInProgress,
} from "../redux/actions/subtitle-improvement.action";
import { Notification } from "../../ui/components/Notification/Notification.component";
import { SubtitleImprovementMetaService } from "../services/subtitle-improvement-meta.service";
import { SubtitleImprovementService } from "../services/subtitle-improvement.service";
import { Avatar } from "./avatar.component";
import { Button } from "./button.component";

type SubtitleImprovementItemProps = WithClassname & {
  subtitleImprovement: SubtitleImprovement;
  block: Block;
  video: Video;
};

export const SubtitleImprovementItem: React.FC<SubtitleImprovementItemProps> =
  ({ subtitleImprovement, block, video }) => {
    const { t } = useTranslation();
    const [openDeleteConfirmation, setOpenDeleteConfirmation] =
      useState<boolean>(false);
    const { user } = useAuth();
    const subtitleImprovementService = useInjection<SubtitleImprovementService>(
      SubtitleImprovementService
    );
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const disableActions: boolean =
      useSelector(
        (state: RootState) =>
          state.subtitleImprovement.find((e) => e.timestamp === block.startTime)
            ?.disableActions
      ) || false;

    const dispatch = useDispatch();

    const subtitleImprovementMetaService =
      useInjection<SubtitleImprovementMetaService>(
        SubtitleImprovementMetaService
      );

    useEffect(() => {
      setIsLiked(
        subtitleImprovement?.subtitleImprovementMeta?.isLiked || false
      );
    }, [subtitleImprovement?.subtitleImprovementMeta?.isLiked]);

    const onLike = () => {
      const likes = subtitleImprovement.likes;
      dispatch(UpdateElementInProgress(block.startTime));
      const newLikesCount = isLiked ? likes - 1 : likes + 1;
      subtitleImprovementMetaService
        .patchIsLiked(subtitleImprovement?.id, !isLiked)
        .then(() =>
          subtitleImprovementService.patchLikes(
            subtitleImprovement.id,
            newLikesCount
          )
        )
        .then(() => {
          dispatch(
            UpdateElementSuccess(block.startTime, {
              ...subtitleImprovement,
              likes: newLikesCount,
              subtitleImprovementMeta: {
                ...subtitleImprovement.subtitleImprovementMeta,
                isLiked: !isLiked,
              },
            } as SubtitleImprovement)
          );
        })
        .catch((e) => dispatch(UpdateElementFailure(block.startTime)));
    };

    const handleDelete = () => {
      dispatch(DeleteElementInProgress(block.startTime));
      subtitleImprovementService
        .delete(subtitleImprovement.id)
        .then(() => {
          dispatch(DeleteElementSuccess(block.startTime, subtitleImprovement));
        })
        .catch((e) => dispatch(DeleteElementFailure(block.startTime)));
    };

    const onApprove = (status: boolean) => {
      dispatch(DeleteElementInProgress(block.startTime));
      subtitleImprovementService
        .patchApproved(subtitleImprovement.id, status)
        .then(() => {
          subtitleImprovement.isApproved = status;
          if (status) {
            dispatch(
              SetBlockSuccess(block.startTime, subtitleImprovement.comment)
            );
          }
          dispatch(DeleteElementSuccess(block.startTime, subtitleImprovement));
        })
        .catch((e) => dispatch(DeleteElementFailure(block.startTime)));
    };

    return (
      <div className="bg-darkgray rounded w-full p-4 pb-6 box-border relative ">
        <Notification show={openDeleteConfirmation}>
          <div className="flex flex-col md:grid md:items-center md:grid-cols-12">
            <div className="col-span-10">
              <Alert type="error">
                <Typography bold as="span" className="text-sm">
                  {t("shared.common.actions.delete")} "{block.text}" ?
                </Typography>
              </Alert>
            </div>
            <div className="flex items-center justify-end md:col-span-2">
              <div
                className="cursor-pointer"
                onClick={() => setOpenDeleteConfirmation(false)}
              >
                <Typography
                  as="span"
                  className="text-sm transition-all hover:underline"
                >
                  {t("shared.common.actions.cancel")}
                </Typography>
              </div>
              <div className="mx-3"></div>
              {!disableActions && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenDeleteConfirmation(false);
                    handleDelete();
                  }}
                >
                  <Typography
                    as="span"
                    className="text-nx-red text-sm transition-all hover:underline"
                    overrideDefaultClasses
                  >
                    {t("shared.common.actions.delete")}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Notification>
        <div className="flex flex-row gap-4 absolute right-4 top-4">
          {(user?.id === subtitleImprovement.createdBy?.id ||
            user?.id === video.publisher?.id) && (
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button>
                    <Typography
                      as="span"
                      className={cn(
                        "flex text-sm md:text-base hover:underline cursor-pointer hover:text-nx-red",
                        disableActions && "opacity-50 pointer-events-none"
                      )}
                    >
                      <DotsVerticalIcon className="w-4 md:w-5 mr-2 text-nx-red" />
                    </Typography>
                  </Menu.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="absolute right-0 w-56 mt-2 p-1 origin-top-right bg-darkgray border-light-black border-2  divide-y divide-nx-dark rounded-md shadow-lg focus:outline-none z-10"
                    >
                      <div className="px-1 py-1 flex flex-col gap-4">
                        {user?.id === subtitleImprovement.createdBy?.id && (
                          <div className="flex flex-col gap-2">
                            <button
                              disabled={disableActions}
                              onClick={() =>
                                dispatch(
                                  UpdateFormElementInProgress(
                                    block.startTime,
                                    subtitleImprovement
                                  )
                                )
                              }
                              className={cn(
                                " text-green-500 hover:text-green-700 p-2 w-full flex items-start gap-2",
                                disableActions &&
                                  "opacity-50 pointer-events-none"
                              )}
                            >
                              <PencilIcon className="h-5 w-5" />
                              {t("shared.common.actions.edit")}
                            </button>
                            <button
                              disabled={disableActions}
                              onClick={() => setOpenDeleteConfirmation(true)}
                              className={cn(
                                "text-nx-red-dark hover:text-nx-red p-2 w-full flex items-start gap-2",
                                disableActions &&
                                  "opacity-50 pointer-events-none"
                              )}
                            >
                              <TrashIcon className="h-5 w-5" />
                              {t("shared.common.actions.delete")}
                            </button>
                          </div>
                        )}
                        {user?.id === video.publisher?.id && (
                          <div className="flex flex-col gap-2">
                            <Menu.Item>
                              <button
                                disabled={disableActions}
                                className={cn(
                                  "text-green-500 hover:text-green-700 p-2 w-full flex items-start gap-2",
                                  disableActions &&
                                    "opacity-50 pointer-events-none"
                                )}
                                onClick={() => onApprove(true)}
                              >
                                <CheckIcon className="h-5 w-5" />
                                {t("subtitleImprovement.content.approve")}
                              </button>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                disabled={disableActions}
                                className={cn(
                                  "text-nx-red-dark hover:text-nx-red p-2 w-full flex items-start gap-2",
                                  disableActions &&
                                    "opacity-50 pointer-events-none"
                                )}
                                onClick={() => onApprove(false)}
                              >
                                <XIcon className="h-5 w-5" />
                                {t("subtitleImprovement.content.disapprove")}
                              </button>
                            </Menu.Item>
                          </div>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          )}
        </div>
        <Avatar subtitleImprovement={subtitleImprovement} />
        <Typography as="h4" className="my-2">
          {subtitleImprovement.comment}
        </Typography>

        <div className="flex flex-row gap-4 absolute -bottom-3 left-0 w-full px-4 box-border">
          <Button
            className={cn(
              "bg-light-black border-2 border-darkgray hover:bg-opacity-60",
              isLiked ? "text-blue-500" : "text-grey-500"
            )}
            disabled={disableActions}
            onClick={() => onLike()}
          >
            <Typography as="p" overrideDefaultClasses={true}>
              {subtitleImprovement.likes}
            </Typography>
            <ThumbUpIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  };
