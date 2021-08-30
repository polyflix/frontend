import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GhostTitle } from '../GhostTitle.component';
import { GhostTile } from '../GhostTile/GhostTile.component';
import styles from './GhostSlider.module.scss';

type Props = {
  count: number
}

export const GhostSlider: React.FC<Props> = ({ count = 5 }) => {
  const ghosts = () => new Array(count).fill(null);

  return (
    <div className="mt-12">
      <GhostTitle className="w-60 mb-4" />
      <Swiper
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
      >
        {ghosts().map((_, i: number) => (
          <SwiperSlide key={i}>
            <div className={styles.root}>
              <GhostTile
                className="absolute top-0 left-0 w-full h-full"
                aspectRatio
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
