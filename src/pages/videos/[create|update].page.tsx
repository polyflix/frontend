import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import VideoForm from "../../components/Forms/Videos/VideoForm.component";
import Page from "../../components/Page/Page.component";
import { useVideos } from "../../hooks/useVideos.hook";
import Video from "../../models/video.model";

const CreateUpdateVideoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data, isLoading } = useVideos<Video>({
    mode: "document",
    slug,
  });

  return (
    <Page
      isLoading={isLoading}
      className="h-full flex items-center justify-center"
      title={`${
        slug ? t("shared.common.actions.edit") : t("shared.common.actions.add")
      } ${t("videoManagement.video")}`}
    >
      <VideoForm video={data} />
    </Page>
  );
};

export default CreateUpdateVideoPage;
