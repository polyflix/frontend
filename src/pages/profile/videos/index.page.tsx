import { VideoService } from "@core/services/videos/video.service";
import { PlusIcon } from "@heroicons/react/outline";
import React from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fadeOpacity from "../../../animations/fadeOpacity";
import Container from "../../../components/Container/Container.component";
import Page from "../../../components/Page/Page.component";
import Paginator from "../../../components/Paginator/Paginator.component";
import Title from "../../../components/Typography/Title/Title.component";
import Typography from "../../../components/Typography/Typography.component";
import VideoListItem from "../../../components/Videos/VideoListItem/VideoListItem.component";
import { useAuth } from "../../../hooks/useAuth.hook";
import usePagination from "../../../hooks/usePagination.hook";
import { useUser } from "../../../hooks/useUser.hook";
import { useVideos } from "../../../hooks/useVideos.hook";
import { Token } from "../../../models/token.model";
import Video from "../../../models/video.model";
import { useInjection } from "../../../modules/di";
import { VideosWithPagination } from "../../../types/videos.type";

const UserVideosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { t } = useTranslation();
  const videoService = useInjection<VideoService>(VideoService);
  const { setFinalPage, page, to } = usePagination();
  const isOwnPage = !id;

  const { data: fetchedUser, isLoading: isLoadingUser, alert } = useUser({
    id,
  });

  const {
    data,
    isLoading: isLoadingVideo,
    triggerReload,
  } = useVideos<VideosWithPagination>({
    onCollectionLoaded: setFinalPage,
    authorId: id,
    mode: "collection",
    page,
  });

  const onVideoDelete = async (id: string) => {
    await videoService.deleteVideo(id, token as Token);
    triggerReload();
  };

  if (alert && alert.type === "not-found") return <Redirect to="/not-found" />;

  return (
    <Page
      isLoading={isLoadingVideo || isLoadingUser}
      variants={fadeOpacity}
      title={
        isOwnPage
          ? t("userVideos.seo.title")
          : `${fetchedUser?.displayName}'s profile`
      }
    >
      <Container mxAuto className="px-5 flex flex-col">
        {alert && alert.type === "error" && (
          <div className="bg-nx-red-dark w-1/4 text-white font-extrabold rounded flex text-center justify-center self-center">
            {`${alert.message}`}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Title className="my-5">
            {isOwnPage
              ? t("userVideos.seo.title")
              : `${fetchedUser?.displayName}'s videos`}
          </Title>
          {isOwnPage && (
            <Link to="/videos/create">
              <Typography
                as="span"
                className="flex items-center text-nx-red"
                overrideDefaultClasses
              >
                <PlusIcon className="w-6" /> {t("shared.common.actions.add")}{" "}
                {t("videoManagement.video")}
              </Typography>
            </Link>
          )}
        </div>
        {data && (
          <>
            {data.videos.map((video: Video) => (
              <VideoListItem
                onDelete={() => onVideoDelete(video.id)}
                key={video.id}
                video={video}
                ownerItems={isOwnPage}
              />
            ))}
            {data.videos.length > 0 ? (
              <Paginator
                className="py-5 justify-end"
                page={page}
                onPageChanged={to}
                total={data.pages}
              />
            ) : (
              <div className="text-white">
                {" "}
                {isOwnPage
                  ? "You have not uploaded any videos yet"
                  : `${fetchedUser?.displayName} has not uploaded any videos yet`}
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  );
};

export default UserVideosPage;
