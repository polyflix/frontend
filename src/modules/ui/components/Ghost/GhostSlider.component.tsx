import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { GhostTitle } from "./GhostTitle.component";
import { GhostTile } from "./GhostTile/GhostTile.component";

type Props = {
  count: number;
};

export const GhostSlider: React.FC<Props> = ({ count = 5 }) => {
  const ghosts = () => {
    return new Array(count).fill(null);
  };

  return (
    <div className="mt-12">
      <GhostTitle className="w-60 mb-4" />
      <Swiper
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        mousewheel={false}
        spaceBetween={10}
      >
        {ghosts().map((_, i: number) => (
          <SwiperSlide key={i}>
            <GhostTile />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
