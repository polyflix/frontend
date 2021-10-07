import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React from "react";
import SwiperCore, { Mousewheel, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { NoData } from "../../../ui/components/NoData/NoData.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { VideoSliderItem } from "../VideoSliderItem/VideoSliderItem.component";
import SliderControl from "./SliderControl.component";
import { IVideoFilter } from "../../filters/video.filter";
import { useVideos } from "../../hooks/useVideos.hook";
import { GhostHeroTile } from "../../../ui";
import { GhostSlider } from "../../../ui/components/Ghost/GhostSlider/GhostSlider.component";

type Props = {
  title: string;
  videosFilter: IVideoFilter;
  hideIfNothing?: boolean;
};

SwiperCore.use([Navigation, Mousewheel]);

/**
 * This behavior of having `useVideos` call is to anticipate
 * Redux arrival & behavior
 */
export const VideoSlider: React.FC<Props> = ({
  videosFilter,
  title,
  hideIfNothing = true,
}) => {
  const { data, isLoading } = useVideos(videosFilter);

  if (isLoading) {
    return (
      <>
        <GhostHeroTile />
        <GhostSlider count={5} />
      </>
    );
  }

  return data && data.totalCount > 0 ? (
    <div>
      <span className="group flex items-center mb-6 w-fit">
        <Typography as="h4" className="text-xl pl-3" bold>
          {title}
        </Typography>
        {/* Removed class  group-hover:translate-x-1 on chevron, as there is no link anymore */}
        <ChevronRightIcon className="w-5 pt-1 text-nx-white transition-transform transform" />
      </span>
      <Swiper
        navigation={{ nextEl: ".control-next", prevEl: ".control-previous" }}
        slidesPerView={1}
        breakpoints={{
          400: {
            slidesPerView: 2,
          },
          800: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        }}
        mousewheel={false}
        spaceBetween={10}
        freeMode
      >
        <SliderControl direction="previous">
          <ChevronLeftIcon className="w-10" />
        </SliderControl>
        {data.items.map((video) => (
          <SwiperSlide key={video.id}>
            <VideoSliderItem video={video} />
          </SwiperSlide>
        ))}
        <SliderControl direction="next">
          <ChevronRightIcon className="w-10" />
        </SliderControl>
      </Swiper>
    </div>
  ) : hideIfNothing ? null : (
    <NoData />
  );
};
