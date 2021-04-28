import { PlusIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import fadeOpacity from "../../../animations/fadeOpacity";
import Container from "../../../components/Container/Container.component";
import Page from "../../../components/Page/Page.component";
import Paginator from "../../../components/Paginator/Paginator.component";
import Title from "../../../components/Typography/Title/Title.component";
import Typography from "../../../components/Typography/Typography.component";
import VideoListItem from "../../../components/Videos/VideoListItem/VideoListItem.component";
import { useAuth } from "../../../hooks/useAuth.hook";
import usePagination from "../../../hooks/usePagination.hook";
import { useVideos } from "../../../hooks/useVideos.hook";
import { Token } from "../../../models/token.model";
import Video from "../../../models/video.model";
import { VideoService } from "../../../services/video.service";
import { VideosWithPagination } from "../../../types/videos.type";

const UserVideosPage: React.FC = () => {
  const { token } = useAuth();
  const { setFinalPage, page, to } = usePagination();

  const { data, isLoading, triggerReload } = useVideos<VideosWithPagination>({
    onCollectionLoaded: setFinalPage,
    userOnly: true,
    mode: "collection",
    page,
  });

  const onVideoDelete = async (id: string) => {
    await VideoService.deleteVideo(id, token as Token);
    triggerReload();
  };

  return (
    <Page isLoading={!data && isLoading} variants={fadeOpacity} title="Profile">
      <Container mxAuto className="px-5">
        <div className="flex items-center justify-between">
          <Title className="my-5">My videos</Title>
          <Link to="/videos/create">
            <Typography
              as="span"
              className="flex items-center text-nx-red"
              overrideDefaultClasses
            >
              <PlusIcon className="w-6" /> Add a new video
            </Typography>
          </Link>
        </div>
        {data && (
          <>
            {data.videos.map((video: Video) => (
              <VideoListItem
                onDelete={() => onVideoDelete(video.id)}
                key={video.id}
                video={video}
              />
            ))}
            <Paginator
              className="py-5 justify-end"
              page={page}
              onPageChanged={to}
              total={data.pages}
            />
          </>
        )}
      </Container>
    </Page>
  );
};

export default UserVideosPage;
