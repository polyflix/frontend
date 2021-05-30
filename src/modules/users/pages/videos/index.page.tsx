import { PlusIcon } from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
import { Token } from "../../../authentication/models/token.model";
import { Paginator } from "../../../common/components/Paginator/Paginator.component";
import { usePagination } from "../../../common/hooks/usePagination.hook";
import { fadeOpacity } from "../../../ui/animations/fadeOpacity";
import { Container } from "../../../ui/components/Container/Container.component";
import { Page } from "../../../ui/components/Page/Page.component";
import { Title } from "../../../ui/components/Typography/Title/Title.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { VideoListItem } from "../../../videos/components/VideoListItem/VideoListItem.component";
import { useVideos } from "../../../videos/hooks/useVideos.hook";
import { Video } from "../../../videos/models/video.model";
import { VideoService } from "../../../videos/services/video.service";
import { VideosWithPagination } from "../../../videos/types/videos.type";
import { useUser } from "../../hooks/useUser.hook";

export const UserVideosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const videoService = useInjection<VideoService>(VideoService);
  const { setFinalPage, page, to, limit } = usePagination();
  const isOwnPage = !id;

  const {
    data: fetchedUser,
    isLoading: isLoadingUser,
    alert,
  } = useUser({
    id,
  });

  const {
    data,
    isLoading: isLoadingVideo,
    triggerReload,
  } = useVideos<VideosWithPagination>({
    onCollectionLoaded: setFinalPage,
    authorId: user?.id as string,
    mode: "collection",
    page,
    limit,
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
          ? t("userVideos.seo.ownTitle")
          : t("userVideos.seo.userTitle", { user: fetchedUser?.displayName })
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
              ? t("userVideos.seo.ownTitle")
              : t("userVideos.seo.userTitle", {
                  user: fetchedUser?.displayName,
                })}
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
                total={Math.floor(data.totalCount / data.videos.length)}
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
