import {
  CheckCircleIcon,
  EyeOffIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "../../ui/components";
import { Typography } from "../../ui/components/Typography/Typography.component";
import { Tag } from "../models/tag.model";
import { Notification } from "../../ui/components/Notification/Notification.component";
import { ActionLink } from "../../common/components/ActionLink.component";
import { Link } from "react-router-dom";

type Props = {
  tag: Tag;
  onDelete: (tag: Tag) => void;
  onReviewed: (tag: Tag) => void;
};

export const TagListItem: React.FC<Props> = ({ tag, onDelete, onReviewed }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <div className="flex my-5 p-2 rounded transition hover:bg-nx-dark">
      <Notification show={open}>
        <div className="flex flex-col md:grid md:items-center md:grid-cols-12">
          <div className="col-span-10">
            <Alert type="error">
              <Typography bold as="span" className="text-sm">
                {t("shared.common.actions.delete")} {tag.label} ?
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
                  onDelete(tag);
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
      <div className="grid grid-cols-3 items-center w-full">
        <div className="flex">
          <Link to={`/search/${tag.label}`}>
            <Typography bold className="text-lg md:text-xl" as="h3">
              {tag.label}
            </Typography>
          </Link>
        </div>
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onReviewed(tag)}
          >
            {tag.isReviewed ? (
              <CheckCircleIcon className="text-green-500 w-6 mr-2" />
            ) : (
              <EyeOffIcon className="text-nx-red w-6 mr-2" />
            )}
            <Typography className="text-sm" as="span">
              {tag.isReviewed ? (
                <>
                  <Typography as="span" className="hover:font-bold">
                    {`${t("shared.common.form.tags.reviewed")}`}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography as="span" className="hover:font-bold">
                    {`${t("shared.common.form.tags.notReviewed")}`}
                  </Typography>
                </>
              )}
            </Typography>
          </div>
        </div>
        <div className="flex w-full items-center justify-end">
          <ActionLink
            Icon={TrashIcon}
            onClick={() => setOpen(true)}
            text={t("shared.common.actions.delete")}
            className={"ml-4"}
          />
        </div>
      </div>
    </div>
  );
};
