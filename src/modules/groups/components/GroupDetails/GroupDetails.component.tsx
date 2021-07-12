import { ChevronRightIcon, PencilIcon } from "@heroicons/react/outline";
import React from "react";
import { cn } from "../../../common/utils/classes.util";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Group } from "../../models/group.model";
import styles from "./group-details.module.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionLink } from "../../../common/components/ActionLink.component";

type Props = {
  group: Group | null;
};

export const GroupDetails: React.FC<Props> = ({ group }) => {
  const { t } = useTranslation();
  const listMembers =
    group?.members.length !== 0
      ? group?.members.map((d) => (
          <li>{d.user.firstName + " " + d.user.lastName}</li>
        ))
      : `${t("groupManagement.nobody")}`;

  return group !== null ? (
    <div className={cn("h-64 2xl:h-72 relative", styles.video_item)}>
      <div
        className={cn(
          "bg-nx-dark w-full p-4 transition-all bg-opacity-80 h-full grid grid-flow-row gap-2 rounded-b-md",
          styles.video_item_info
        )}
      >
        {" "}
        <Typography bold as="h3">
          {group.title}
        </Typography>
        <div className="flex justify-end items-center">
          <ActionLink
            Icon={PencilIcon}
            text={t("shared.common.actions.edit")}
            to={group.editLink}
            className={"ml-4"}
          />
        </div>
        <div className="grid grid-flow-col gap-2 justify-start items-center">
          <Typography as="h5">{listMembers}</Typography>
        </div>
        <Link
          to={`/groups/join/${group?.slug}`}
          className="flex justify-center items-center"
        >
          <Typography as="h1" className="text-xl pl-1" bold>
            {t("groupManagement.seo.join")}
          </Typography>
          <ChevronRightIcon className="w-5 pt-1 text-nx-white" />
        </Link>
      </div>
    </div>
  ) : (
    <div className="text-white">{t("shared.common.errors.noData")}</div>
  );
};
