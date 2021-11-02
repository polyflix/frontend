import { Box } from '@mui/material'
import React, { PropsWithChildren, ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import { buildSkeletons } from '@core/utils/gui.utils'

import { VideoCardSkeleton } from '@videos/components/Skeleton/VideoCardSkeleton/VideoCardSkeleton.component'

interface Props {
  isLoading?: boolean
  ghostsCount?: number
  freeMode?: boolean
  heading?: ReactNode
}

export const Slider = ({
  children,
  freeMode = false,
  heading,
  isLoading = false,
  ghostsCount = 4,
}: PropsWithChildren<Props>) => {
  const ghosts = buildSkeletons(ghostsCount)
  return (
    <>
      {heading && <Box sx={{ mb: 2 }}>{heading}</Box>}
      <Swiper
        style={{ overflow: 'visible' }}
        spaceBetween={10}
        freeMode={freeMode}
        breakpoints={{
          0: {
            slidesPerView: 2.25,
          },
          900: {
            slidesPerView: 3.25,
          },
          1200: {
            slidesPerView: 4.25,
          },
          1536: {
            slidesPerView: 5.25,
          },
        }}
      >
        {isLoading
          ? ghosts.map((_, index) => (
              <SwiperSlide style={{ width: '350px !important' }} key={index}>
                <VideoCardSkeleton key={index} />
              </SwiperSlide>
            ))
          : React.Children.map(children, (child, index) => (
              <SwiperSlide style={{ width: '350px !important' }} key={index}>
                {child}
              </SwiperSlide>
            ))}
      </Swiper>
    </>
  )
}
