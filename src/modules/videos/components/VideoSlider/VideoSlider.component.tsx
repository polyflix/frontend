import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import SwiperCore, { Mousewheel, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { NoData } from "../../../ui/components/NoData/NoData.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import { VideoSliderItem } from "../VideoSliderItem/VideoSliderItem.component";
import SliderControl from "./SliderControl.component";

type Props = {
  title: string;
  videos: Video[];
  hideIfNothing?: boolean;
};

SwiperCore.use([Navigation, Mousewheel]);
export const VideoSlider: React.FC<Props> = ({
  videos,
  title,
  hideIfNothing = true,
}) => {
  return videos.length !== 0 ? (
    <div>
      <Link to="#" className="flex items-center mb-3">
        <Typography as="h4" className="text-xl pl-3" bold>
          {title}
        </Typography>
        <ChevronRightIcon className="w-5 pt-1 text-nx-white" />
      </Link>
      <Swiper
        navigation={{ nextEl: ".control-next", prevEl: ".control-previous" }}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        mousewheel
        spaceBetween={10}
        freeMode
      >
        <SliderControl direction="previous">
          <ChevronLeftIcon className="w-10" />
        </SliderControl>
        {videos.map((video) => (
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
