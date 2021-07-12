import React from "react";
import { useTranslation } from "react-i18next";
import { Page } from "../../ui/components/Page/Page.component";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { useGroups } from "../hooks/useGroupHooks";
import { useUser } from "../../users/hooks/useUser.hook";
import { useParams } from "react-router";
import { Group } from "../models/group.model";
import { GroupSlider } from "../components/GroupSlider/GroupSlider.component";
import { Container, Title, Typography } from "../../ui";
import { PlusIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

export const GroupsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { isLoading: isLoadingUser } = useUser({
    id,
  });
  const { data, isLoading: isLoadingGroup } = useGroups<Group[]>({
    mode: "collection",
  });

  const joined_groups = useGroups<Group[]>({
    mode: "collection",
    type: "joined",
  });

  const updateJoinedGroup = () => {
    joined_groups.triggerReload();
  };

  const { t } = useTranslation();
  return (
    <Page
      isLoading={isLoadingGroup || isLoadingUser}
      variants={fadeOpacity}
      title={t("groupManagement.seo.title")}
    >
      {data && (
        <>
          <Container mxAuto className="px-5 flex flex-col">
            <div className="flex items-center justify-between">
              <Title className="my-5">{t("groupManagement.seo.title")}</Title>
              <Link to="/groups/create">
                <Typography
                  as="span"
                  className="flex items-center text-nx-red"
                  overrideDefaultClasses
                >
                  <PlusIcon className="w-6" />
                  {t("shared.common.actions.add") +
                    " " +
                    t("groupManagement.group")}
                </Typography>
              </Link>
            </div>

            <GroupSlider
              title={t("groupManagement.seo.all")}
              groups={data}
              isJoined={false}
              updateMethod={updateJoinedGroup}
            />
            <GroupSlider
              title={t("groupManagement.seo.joined")}
              groups={joined_groups.data}
              text_no_data={t("groupManagement.nodata")}
              button_text={t("groupManagement.seo.leave")}
              updateMethod={updateJoinedGroup}
              isJoined={true}
            />
          </Container>
        </>
      )}
    </Page>
  );
};
