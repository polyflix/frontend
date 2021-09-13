import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  InformationCircleIcon,
  PlayIcon,
  ThumbUpIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../common/utils/classes.util";
import { Alert } from "../../../ui/components/Alert/Alert.component";
import { Image } from "../../../ui/components/Image/Image.component";
import { Notification } from "../../../ui/components/Notification/Notification.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import { VideoListItemOptions } from "./VideoListItemOptions.component";
import { ActionLink } from "../../../common/components/ActionLink.component";
import { Tag } from "../../../tags/models/tag.model";
import { TagBadge } from "../../../tags/components/TagBadge.component";

type Props = {
  video: Video;
  onDelete?: () => void;
  ownerItems?: boolean;
  links?: boolean;
  tags?: Tag[];
};

/**
 * Simple tile of a video, left is the thumbnail, right is composed
 * of title, isPublished or isPublic, views & likes & some actions buttons
 * @param video
 * @param onDelete
 * @param ownerItems
 * @param links -- Define whether the update & stats links must be shown (delete is still shown)
 */
export const VideoListItem: React.FC<Props> = ({
  video,
  onDelete,
  ownerItems = true,
  links = true,
  tags = [],
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { userMeta } = video;

  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <Notification key={video.id} show={open}>
        <div className="flex flex-col md:grid md:items-center md:grid-cols-12">
          <div className="col-span-10">
            <Alert type="error">
              <Typography bold as="span" className="text-sm">
                {t("shared.common.actions.delete")} {video.title} ?
              </Typography>
            </Alert>
          </div>
          <div className="flex items-center justify-end md:col-span-2">
            <div className="cursor-pointer" onClick={() => setOpen(false)}>
              <Typography
                as="span"
                className="text-sm transition-all hover:underline"
              >
                {t("shared.common.actions.cancel")}
              </Typography>
            </div>
            <div className="mx-3"></div>
            {onDelete && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  onDelete();
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
      <div className="col-span-12 md:col-span-4 xl:col-span-3">
        <Image
          src={video.thumbnail}
          className="rounded-md w-full md:h-48 object-cover"
          alt={`${video.title} thumbnail`}
        />
        {userMeta && (
          <div
            className="bg-nx-red relative bottom-1 h-1 z-10"
            style={{
              width: userMeta.watchedPercent * 100 + "%",
            }}
          />
        )}
      </div>
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <div className="flex">
          <Typography bold className="text-lg md:text-xl" as="h3">
            {video.title}
          </Typography>
          {ownerItems && links && (
            <div className="ml-auto text-white">
              <VideoListItemOptions
                onTriggerDelete={() => setOpen(true)}
                editLink={video.getEditLink()}
                statsLink={video.getStatsLink()}
              />
            </div>
          )}
        </div>
        <div className={`my-2 ${ownerItems ? "flex" : "hidden"} items-center`}>
          <Typography
            as="span"
            overrideDefaultClasses
            bold
            className={cn(
              video.isPublished ? "text-green-500" : "text-nx-red",
              "flex items-center text-sm md:text-base"
            )}
          >
            {video.isPublished ? (
              <>
                <EyeIcon className="w-5 mr-2" />{" "}
                {t("userVideos.status.published.name")}
              </>
            ) : (
              <>
                <EyeOffIcon className="w-5 mr-2" />{" "}
                {t("userVideos.status.draft.name")}
              </>
            )}
          </Typography>
          <div className="mx-2"></div>
          <Typography
            as="span"
            overrideDefaultClasses
            bold
            className={cn(
              video.isPublic ? "text-green-500" : "text-nx-red",
              "flex items-center text-sm md:text-base"
            )}
          >
            {video.isPublic ? (
              <>
                <GlobeIcon className="w-5 mr-2" />{" "}
                {t("userVideos.visibility.public.name")}
              </>
            ) : (
              <>
                <UserIcon className="w-5 mr-2" />{" "}
                {t("userVideos.visibility.private.name")}
              </>
            )}
          </Typography>
        </div>
        <div className={`flex items-center`}>
          <Typography
            as="span"
            overrideDefaultClasses
            bold
            className="text-blue-500 flex items-center text-sm md:text-base"
          >
            <EyeIcon className="w-5 mr-2" /> {video.views}
          </Typography>
          <div className="mx-2"></div>

          <Typography
            as="span"
            overrideDefaultClasses
            bold
            className="text-blue-500 flex items-center text-sm md:text-base"
          >
            <ThumbUpIcon className="w-5 mr-2" /> {video.likes}
          </Typography>
        </div>
        <div className="flex items-center my-2">
          {links && (
            <ActionLink
              Icon={PlayIcon}
              to={video.getStreamLink()}
              text={t("shared.common.actions.play")}
            />
          )}
          {links && (
            <ActionLink
              Icon={InformationCircleIcon}
              to={video.getInfoLink()}
              text={t("shared.common.actions.info")}
              className={"ml-4"}
            />
          )}
          {!links && (
            <ActionLink
              Icon={TrashIcon}
              onClick={() => setOpen(true)}
              text={t("shared.common.actions.delete")}
              className={"ml-4"}
            />
          )}
          {!ownerItems && userMeta && (
            <span className="text-nx-gray opacity-80 px-4 text-sm">
              {t("shared.common.seen", {
                date: new Date(userMeta.updatedAt).toLocaleDateString(),
              })}
            </span>
          )}
          {ownerItems && (
            <span className="text-nx-gray opacity-80 px-4 text-sm">
              {t("shared.common.createdAt", {
                date: new Date(video.createdAt).toLocaleDateString(),
              })}
            </span>
          )}
        </div>
        {tags.length !== 0 && (
          <div className="mt-4">
            {tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
