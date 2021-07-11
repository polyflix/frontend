import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Alert } from "../../../ui/components";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Notification } from "../../../ui/components/Notification/Notification.component";
import { Collection } from "../../models";
import { ActionLink } from "../../../common/components/ActionLink.component";

type Props = {
  collection: Collection;
  onDelete?: () => void; // commented to simplify upgrade
  ownerItems?: boolean;
  links?: boolean;
};

export const CollectionListItem: React.FC<Props> = ({
  collection,
  onDelete,
  ownerItems = true,
  links = true,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <Notification show={open}>
        <div className="flex flex-col md:grid md:items-center md:grid-cols-12">
          <div className="col-span-10">
            <Alert type="error">
              <Typography bold as="span" className="text-sm">
                {t("shared.common.actions.delete")} {collection.title} ?
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
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <Typography bold className="text-lg md:text-xl" as="h3">
          {collection.title}
        </Typography>
        <Paragraph className="mb-4">{collection.shortDescription}</Paragraph>
        {collection.videos ? (
          <Link
            to={
              "/watch/" +
              collection.videos[0].slug +
              "?c=" +
              collection.slug +
              "&index=0"
            }
            className="bg-nx-red px-4 py-2 rounded-md text-lg transition-colors w-fit inline-block text-white hover:bg-nx-red-dark"
          >
            {t("collections.actions.goto")}
          </Link>
        ) : (
          <Link
            to={"#"}
            className="bg-nx-red px-4 py-2 cursor-not-allowed opacity-50 rounded-md text-lg transition-colors w-fit inline-block text-white"
          >
            {t("collections.actions.noGoto")}
          </Link>
        )}
      </div>
      <div className="flex items-center">
        {ownerItems && (
          <ActionLink
            Icon={PencilIcon}
            text={t("shared.common.actions.edit")}
            to={collection.getEditLink()}
            className={"ml-4"}
          />
        )}
        {(ownerItems || !links) && (
          <ActionLink
            Icon={TrashIcon}
            text={t("shared.common.actions.delete")}
            onClick={() => setOpen(true)}
            className={"ml-4"}
          />
        )}
        {ownerItems && (
          <span className="text-nx-gray opacity-80 px-4 text-sm">
            {t("shared.common.createdAt", {
              date: new Date(collection.createdAt).toLocaleDateString(),
            })}
          </span>
        )}
      </div>
    </div>
  );
};
