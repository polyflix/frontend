import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  InformationCircleIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Video from "../../../models/video.model";
import { cn } from "../../../utils/classes.util";
import Alert from "../../Alert/Alert.component";
import Image from "../../Image/Image.component";
import Notification from "../../Notification/Notification.component";
import Paragraph from "../../Typography/Paragraph/Paragraph.component";
import Typography from "../../Typography/Typography.component";

type Props = {
  video: Video;
  onDelete: () => void;
};

const VideoListItem: React.FC<Props> = ({ video, onDelete }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const buildActionLink = (
    Icon: any,
    text: string,
    to: string,
    className: string = "",
    onClick?: () => void
  ) => {
    const content = (
      <Typography
        as="span"
        className={cn(
          "flex text-sm md:text-base hover:underline cursor-pointer hover:text-nx-red",
          className
        )}
      >
        <Icon className="w-4 md:w-5 mr-2 text-nx-red" /> {text}
      </Typography>
    );
    return onClick ? (
      <span onClick={onClick}>{content}</span>
    ) : (
      <Link to={to}>{content}</Link>
    );
  };

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
          </div>
        </div>
      </Notification>
      <div className="col-span-12 md:col-span-4 xl:col-span-3">
        <Image
          src={video.thumbnail}
          className="rounded-md w-full md:h-48"
          alt={`${video.title} thumbnail`}
        />
      </div>
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <Typography bold className="text-lg md:text-xl" as="h3">
          {video.title}
        </Typography>
        <div className="my-4 flex items-center">
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
        <Paragraph className="mb-4">{video.shortDescription}</Paragraph>
        <div className="flex items-center">
          {buildActionLink(
            PlayIcon,
            t("shared.common.actions.play"),
            video.getStreamLink()
          )}
          {buildActionLink(
            InformationCircleIcon,
            t("shared.common.actions.info"),
            video.getInfoLink(),
            "ml-4"
          )}
          {buildActionLink(
            PencilIcon,
            t("shared.common.actions.edit"),
            video.getEditLink(),
            "ml-4"
          )}
          {buildActionLink(
            TrashIcon,
            t("shared.common.actions.delete"),
            "#",
            "ml-4",
            () => setOpen(true)
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoListItem;
