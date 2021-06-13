import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { VideoTileGhost } from "../VideoTileGhost/VideoTileGhost.component";
import { cn } from "../../../common/utils";
import styles from "../../../common/styles/ghost.module.scss";
export const VideosGhostSlider: React.FC = () => {
  return (
    <div className={cn(styles.video_ghost, styles.text_ghost, "mt-12")}>
      <span
        className={cn(
          "text-xl pl-3 h-12 w-2/12",
          styles.ghost_line,
          styles.ghost_line__tile
        )}
      >
        sa
      </span>
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
        {new Array(5).fill(null).map((_, i: number) => (
          <SwiperSlide key={i}>
            <VideoTileGhost />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
