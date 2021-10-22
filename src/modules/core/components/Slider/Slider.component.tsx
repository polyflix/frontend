import { Box } from '@mui/material'
import React, { PropsWithChildren, ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

interface Props {
  freeMode?: boolean
  heading?: ReactNode
}

export const Slider = ({
  children,
  freeMode = false,
  heading,
}: PropsWithChildren<Props>) => {
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
        {React.Children.map(children, (child, index) => (
          <SwiperSlide style={{ width: '350px !important' }} key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
