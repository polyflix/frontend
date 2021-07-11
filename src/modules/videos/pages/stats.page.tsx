import React, { useEffect, useState } from "react";
import {
  Container,
  fadeOpacity,
  GhostTile,
  Image,
  Page,
  stagger,
  Typography,
} from "../../ui";
import { useParams } from "react-router";
import { useVideo } from "../hooks/useVideo.hook";
import { motion } from "framer-motion";
import { Video } from "../models";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GhostParagraph } from "../../ui/components/Ghost/GhostParagraph";
import { GoBack } from "../../common/components/Navigation/GoBack.component";
import { StatTile } from "../../stats/components/StatTile.component";
import { GhostStatTile } from "../../ui/components/Ghost/GhostStatTile.component";
import { ResponsiveViewChart } from "../../stats/components/ViewChart.component";

type statTileProps = {
  title: string;
  number: string;
};

export const StatsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: video, isLoading: isVideoLoading } = useVideo(slug);
  const [stats, setStats] = useState<statTileProps[]>([]);

  useEffect(() => {
    setTimeout(
      () =>
        setStats([
          {
            title: `${t("shared.common.views")} ${t(
              "shared.common.dates.thisWeek"
            ).toLowerCase()}`,
            number: "47 695",
          },
          {
            title: `${t("shared.common.likes")} ${t(
              "shared.common.dates.thisWeek"
            ).toLowerCase()}`,
            number: "47 695",
          },
          {
            title: `${t("shared.common.comments")} ${t(
              "shared.common.dates.thisWeek"
            ).toLowerCase()}`,
            number: `${t("shared.common.dates.soon")} 👀`,
          },
        ]),
      1500
    );
  }, [t]);

  return (
    <Page
      withNavbar={true}
      variants={fadeOpacity}
      title={`Stats - ${video?.title ?? "loading..."}`}
      isLoading={isVideoLoading}
    >
      <motion.div
        variants={stagger(0.1)}
        className="p-5 w-full md:w-8/12 mx-auto"
      >
        <GoBack />
        <Container mxAuto fluid className="p-4 pb-8 text-white">
          {video ? <VideoShortView video={video} /> : <VideoShortViewGhost />}
          <div className="grid grid-cols-12 gap-5 my-10 lg:divide-x lg:divide-red-700">
            {stats.length === 0
              ? new Array(3)
                  .fill(0)
                  .map((_, index) => <GhostStatTile key={index} />)
              : stats.map((item) => (
                  <StatTile
                    key={item.title}
                    title={item.title}
                    number={item.number}
                  />
                ))}
          </div>
          <div className="h-96 w-full">
            <ResponsiveViewChart />
          </div>
        </Container>
      </motion.div>
    </Page>
  );
};

const VideoShortView: React.FC<{ video: Video }> = ({ video }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <div className="col-span-12 md:col-span-4 xl:col-span-2 ">
        <Link to={video.getStreamLink()}>
          <Image
            src={video.thumbnail}
            className="rounded-md w-full md:h-32 object-cover"
            alt={`${video.title} thumbnail`}
          />
        </Link>
      </div>
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <Typography bold className="text-lg md:text-xl" as="h3">
          {video.title}
          <span className="text-nx-gray text-sm text-opacity-60 pl-4">
            {t("shared.common.createdAt", {
              date: new Date(video.createdAt).toLocaleDateString(),
            })}
          </span>
        </Typography>
        <Typography as="p">{video.shortDescription}</Typography>
      </div>
    </div>
  );
};

const VideoShortViewGhost: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <div className="col-span-12 md:col-span-4 xl:col-span-2 ">
        <GhostTile aspectRatio={true} />
      </div>
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <GhostParagraph count={4} />
      </div>
    </div>
  );
};
