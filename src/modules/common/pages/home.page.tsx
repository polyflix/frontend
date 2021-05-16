import React from "react";
import { useTranslation } from "react-i18next";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { Page } from "../../ui/components/Page/Page.component";
import { VideoHero } from "../../videos/components/VideoHero/VideoHero.component";
import { VideoSlider } from "../../videos/components/VideoSlider/VideoSlider.component";
import { VideoTile } from "../../videos/components/VideoTile/VideoTile.component";
import { useVideos } from "../../videos/hooks/useVideos.hook";
import { VideosWithPagination } from "../../videos/types/videos.type";

export const HomePage: React.FC = () => {
  const { data, isLoading } = useVideos<VideosWithPagination>();
  const { t } = useTranslation();

  return (
    <Page
      isLoading={isLoading}
      variants={fadeOpacity}
      withPadding={false}
      title={t("home.seo.title")}
    >
      {data?.videos && (
        <>
          <VideoHero video={data.videos[0]} />
          <div className="pb-8"></div>
          <VideoSlider title="Top rated" videos={data.videos} />
          <div className="pb-8"></div>
          <VideoTile video={data.videos[5]} />
          <div className="pb-8"></div>
          <VideoSlider title="Latest" videos={data.videos} />
          <div className="pb-8"></div>
          <VideoSlider title="Popular" videos={data.videos} />
          <div className="pb-8"></div>
        </>
      )}
    </Page>
  );
};
