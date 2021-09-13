import { PlusIcon } from "@heroicons/react/solid";
import { useInjection } from "@polyflix/di/dist/hooks/useInjection.hook";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
import { Paginator } from "../../../common/components/Paginator/Paginator.component";
import { usePagination } from "../../../common/hooks/usePagination.hook";
import { fadeOpacity } from "../../../ui/animations/fadeOpacity";
import { Container } from "../../../ui/components/Container/Container.component";
import { Jumbotron } from "../../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../../ui/components/Page/Page.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { useUser } from "../../../users/hooks/useUser.hook";
import { VideoListItem } from "../../../videos/components/VideoListItem/VideoListItem.component";
import { useVideos } from "../../../videos/hooks/useVideos.hook";
import { Video } from "../../../videos/models/video.model";
import { VideoService } from "../../../videos/services/video.service";

export const AdminVideoPage: React.FC = () => {
  const { user } = useAuth();
  const id = user?.id;
  const { t } = useTranslation();

  const videoService = useInjection<VideoService>(VideoService);
  const { setFinalPage, page, to, limit } = usePagination();

  const { data: fetchedUser } = useUser({
    id,
  });

  const { data, refresh } = useVideos(
    {
      page,
      pageSize: limit,
      order: "-createdAt",
    },
    setFinalPage
  );

  const onVideoDelete = async (id: string) => {
    await videoService.deleteVideo(id);
    refresh();
  };

  return (
    <Page title={t("admin.onBoarding.videos.title")} variants={fadeOpacity}>
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t("admin.onBoarding.videos.title")}
          content={t("admin.onBoarding.question")}
        />
        <div className="mt-5">
          <Typography
            as="span"
            className="flex items-center text-nx-red"
            overrideDefaultClasses
          >
            <Link to="/videos/new">
              <span className="inline-flex mx-2">
                <PlusIcon className="w-6" /> {t("shared.common.actions.add")}{" "}
                {t("videoManagement.video")}
              </span>
            </Link>
          </Typography>
        </div>
        <div className="mx-5">
          {data && (
            <>
              {data.items.map((video: Video) => (
                <VideoListItem
                  onDelete={() => onVideoDelete(video.id)}
                  key={video.id}
                  video={video}
                  ownerItems={true}
                />
              ))}
              {data.items.length > 0 ? (
                <Paginator
                  className="py-5 justify-end"
                  page={page}
                  onPageChanged={to}
                  total={Math.floor(data.totalCount / data.items.length)}
                />
              ) : (
                <div className="text-white">
                  {t("userVideos.list.userNoVideos", {
                    user: fetchedUser?.displayName,
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Page>
  );
};
