import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Alert, Button } from "../../../ui/components";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Notification } from "../../../ui/components/Notification/Notification.component";
import { Collection } from "../../models";
import { ActionLink } from "../../../common/components/ActionLink.component";
import { Tag } from "../../../tags/models/tag.model";
import { cn } from "../../../common";
import { TagBadge } from "../../../tags/components/TagBadge.component";

type Props = {
  collection: Collection;
  onDelete?: () => void; // commented to simplify upgrade
  ownerItems?: boolean;
  links?: boolean;
  tags?: Tag[];
};

export const CollectionListItem: React.FC<Props> = ({
  collection,
  onDelete,
  ownerItems = true,
  links = true,
  tags = [],
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
          {ownerItems && (
            <span className="text-nx-gray opacity-80 px-4 text-sm font-normal">
              {t("shared.common.createdAt", {
                date: new Date(collection.createdAt).toLocaleDateString(),
              })}
            </span>
          )}
        </Typography>
        <Paragraph className="mb-4">{collection.shortDescription}</Paragraph>
        <div className="flex items-center">
          <Link
            to={`/watch?v=0&c=${collection.slug}&index=0&visibility=${collection.visibility}`}
          >
            {collection.videos && (
              <Button
                as="button"
                disabled={collection.videos.length === 0}
                className={cn(
                  collection.videos.length === 0
                    ? "bg-lightgray hover:bg-lightgray"
                    : "bg-nx-red hover:bg-nx-red-dark",
                  " px-4 py-2 rounded-md text-lg transition-colors w-fit inline-block text-white "
                )}
              >
                {t("collections.actions.goto")}
              </Button>
            )}
          </Link>
          {tags.length !== 0 && (
            <div className="flex items-center mx-4">
              {tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center flex-shrink flex-grow">
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
      </div>
    </div>
  );
};
