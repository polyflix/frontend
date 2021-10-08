import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { useEffect } from 'react'
import SwiperCore, { Mousewheel, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { NoData } from '../../../ui/components/NoData/NoData.component'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import { Collection } from '../../models/collections.model'
import { CollectionSliderItem } from '../CollectionSliderItem/CollectionSliderItem.component'
import SliderControl from './CollectionControl.component'

type Props = {
  collection: Collection
  hideIfNothing?: boolean
  startIndex: number
}

SwiperCore.use([Navigation, Mousewheel])
export const CollectionSlider: React.FC<Props> = ({
  collection,
  hideIfNothing = true,
  startIndex,
}) => {
  const [playlistIndex, setPlaylistIndex] = useState(startIndex)

  useEffect(() => {
    setPlaylistIndex(startIndex)
  }, [startIndex])

  const buildQuery = (index: number): URLSearchParams => {
    const query = new URLSearchParams()
    query.append('c', `${collection.slug}`)
    query.append('index', `${index}`)
    return query
  }

  return collection?.videos?.length !== 0 ? (
    <div>
      <div className="flex items-center mb-5">
        <Typography as="h4" className="text-xl pl-3 truncate" bold>
          {collection.title}
        </Typography>
        <ChevronRightIcon className="w-5 pt-1 text-nx-white" />
      </div>
      <Swiper
        navigation={{ nextEl: '.control-next', prevEl: '.control-previous' }}
        breakpoints={{
          550: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 2,
          },
          700: {
            slidesPerView: 3,
          },
          900: {
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
        {collection?.videos?.map((video, i: number) => (
          <SwiperSlide key={video.id}>
            <CollectionSliderItem
              video={video}
              currentIndex={i}
              querry={buildQuery}
              isSelected={i === playlistIndex}
            />
          </SwiperSlide>
        ))}
        <SliderControl direction="next">
          <ChevronRightIcon className="w-10" />
        </SliderControl>
      </Swiper>
    </div>
  ) : hideIfNothing ? null : (
    <NoData />
  )
}
