import React from "react";
import { useTranslation } from "react-i18next";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { GhostHeroTile } from "../../ui/components/Ghost/GhostHeroTile.component";
import { GhostSlider } from "../../ui/components/Ghost/GhostSlider.component";
import { Page } from "../../ui/components/Page/Page.component";
import { VideoHero } from "../../videos/components/VideoHero/VideoHero.component";
import { VideoSlider } from "../../videos/components/VideoSlider/VideoSlider.component";
import { VideoTile } from "../../videos/components/VideoTile/VideoTile.component";
import { useVideos } from "../../videos/hooks/useVideos.hook";

export const HomePage: React.FC = () => {
  const { data, isLoading } = useVideos({ isPublic: true, isPublished: true });
  const { data: watchedVideos, isLoading: isLoadingWatched } = useVideos({
    isWatched: true,
  });
  const { data: watchingVideos, isLoading: isLoadingWatching } = useVideos({
    isWatching: true,
  });
  const { t } = useTranslation();

  return (
    <Page
      variants={fadeOpacity}
      withPadding={false}
      title={t("home.seo.title")}
    >
      {data?.items &&
      watchedVideos?.items &&
      watchingVideos?.items &&
      !isLoading &&
      !isLoadingWatched &&
      !isLoadingWatching ? (
        <>
          <VideoHero video={data.items[0]} />
          <div className="pb-8" />
          <VideoSlider
            title={t("home.sliders.continue_watching")}
            videos={watchingVideos.items}
          />
          <div className="pb-8" />
          <VideoTile video={data.items[3]} />
          <div className="pb-8" />
          <VideoSlider title={t("home.sliders.latest")} videos={data.items} />
          <div className="pb-8" />
          <VideoSlider title={t("home.sliders.popular")} videos={data.items} />
          <div className="pb-8" />
          <VideoSlider
            title={t("home.sliders.watch_again")}
            videos={watchedVideos.items}
          />
          <div className="pb-8" />
        </>
      ) : (
        <>
          <GhostHeroTile />
          <GhostSlider count={5} />
          <GhostSlider count={5} />
        </>
      )}
    </Page>
  );
};
