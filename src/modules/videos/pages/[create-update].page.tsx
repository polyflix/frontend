import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Page } from "../../ui/components/Page/Page.component";
import { VideoForm } from "../components/VideoForm/VideoForm.component";
import { useVideo } from "../hooks/useVideo.hook";

export const CreateUpdateVideoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data, isLoading } = useVideo(slug);

  return (
    <Page
      isLoading={isLoading}
      title={`${
        slug ? t("shared.common.actions.edit") : t("shared.common.actions.add")
      } ${t("videoManagement.video")}`}
    >
      <VideoForm video={data} />
    </Page>
  );
};
