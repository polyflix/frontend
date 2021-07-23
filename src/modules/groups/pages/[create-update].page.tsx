import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Page } from "../../ui";
import { Group } from "../models/group.model";
import { GroupForm } from "../components/GroupForm/GroupForm.component";
import { useGroups } from "../hooks/useGroupHooks";

export const CreateUpdateGroupPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data, isLoading } = useGroups<Group>({
    mode: "document",
    slug,
  });

  return (
    <Page
      isLoading={isLoading}
      className="h-full flex items-center justify-center"
      title={`${
        slug ? t("shared.common.actions.edit") : t("shared.common.actions.add")
      } ${t("groupManagement.group")}`}
    >
      <GroupForm group={data} />
    </Page>
  );
};
