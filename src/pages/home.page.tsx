import { useVideos } from "@core/hooks/useVideos.hook";
import { VideosWithPagination } from "@core/types/videos.type";
import fadeOpacity from "@ui/animations/fadeOpacity";
import Page from "@ui/components/Page/Page.component";
import VideoHero from "@ui/components/Videos/VideoHero/VideoHero.component";
import VideoSlider from "@ui/components/Videos/VideoSlider/VideoSlider.component";
import VideoTile from "@ui/components/Videos/VideoTile/VideoTile.component";
import React from "react";

const HomePage: React.FC = () => {
  const { data, isLoading } = useVideos<VideosWithPagination>();

  return (
    <Page
      isLoading={isLoading}
      variants={fadeOpacity}
      withPadding={false}
      title="Home"
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

export default HomePage;
