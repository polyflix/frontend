import { PlusIcon } from "@heroicons/react/outline";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, NoData, Typography } from "../../ui";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { GhostHeroTile } from "../../ui/components/Ghost/GhostHeroTile.component";
import { GhostSlider } from "../../ui/components/Ghost/GhostSlider/GhostSlider.component";
import { Page } from "../../ui/components/Page/Page.component";
import { VideoHero } from "../../videos/components/VideoHero/VideoHero.component";
import { VideoSlider } from "../../videos/components/VideoSlider/VideoSlider.component";
import { VideoTile } from "../../videos/components/VideoTile/VideoTile.component";
import { useVideos } from "../../videos/hooks/useVideos.hook";

export const HomePage: React.FC = () => {
  const { data, isLoading } = useVideos({ isPublic: true, isPublished: true });
  let { data: watchedVideos, isLoading: isLoadingWatched } = useVideos({
    isWatched: true,
  });

  const { data: watchingVideos, isLoading: isLoadingWatching } = useVideos({
    isWatching: true,
  });
  const { t } = useTranslation();

  function getRandomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  return (
    <Page
      variants={fadeOpacity}
      withPadding={false}
      title={t("home.seo.title")}
    >
      {data && !isLoading && !isLoadingWatched && !isLoadingWatching ? (
        <>
          <VideoHero video={data.items[0]} />
          <div className="pb-8" />
          {data?.items &&
          watchedVideos?.items &&
          watchingVideos?.items &&
          (data?.items.length ||
            watchedVideos?.items.length ||
            watchingVideos?.items.length) ? (
            <>
              <VideoSlider
                title={t("home.sliders.continue_watching")}
                videos={watchingVideos?.items}
              />
              <div className="pb-16" />
              <VideoTile
                video={data.items[getRandomRange(1, data.items.length)]}
              />
              <div className="pb-16" />
              <VideoSlider
                title={t("home.sliders.latest")}
                videos={data.items}
              />
              <div className="pb-16" />
              <VideoSlider
                title={t("home.sliders.popular")}
                videos={data.items}
              />
              <div className="pb-16" />
              <VideoSlider
                title={t("home.sliders.watch_again")}
                videos={watchedVideos?.items}
              />
              <div className="pb-8" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center pb-6">
              <NoData />
              <Link to="videos/create">
                <Button
                  as="button"
                  className="flex items-center bg-nx-white text-nx-dark mt-8"
                >
                  <PlusIcon className="w-6" />{" "}
                  <Typography
                    overrideDefaultClasses
                    className="ml-1 text-sm md:text-base"
                    as="span"
                  >
                    {t("home.errors.createVideo")}
                  </Typography>
                </Button>
              </Link>
            </div>
          )}
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
