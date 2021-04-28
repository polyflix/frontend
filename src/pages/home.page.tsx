import React from "react";
import fadeOpacity from "../animations/fadeOpacity";
import Page from "../components/Page/Page.component";
import VideoHero from "../components/Videos/VideoHero/VideoHero.component";
import VideoSlider from "../components/Videos/VideoSlider/VideoSlider.component";
import VideoTile from "../components/Videos/VideoTile/VideoTile.component";
import { useVideos } from "../hooks/useVideos.hook";
import { VideosWithPagination } from "../types/videos.type";

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
