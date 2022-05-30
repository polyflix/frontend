import { Typography, Box } from '@mui/material'
import {
  SearchQuiz,
  SearchUser,
  SearchVideo,
} from '@search/models/search.model'
import SwiperCore, { FreeMode, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { SearchResult } from './SearchResult.component'

SwiperCore.use([Mousewheel, FreeMode])

type SearchSliderProps = {
  closeModal: () => void
  query: string
  results: SearchVideo[] | SearchQuiz[] | SearchUser[]
  title: string
}

export const SearchSlider: React.FC<SearchSliderProps> = ({
  title,
  results,
  closeModal,
  query,
}: SearchSliderProps) => {
  if (results.length === 0) return <Box />
  return (
    <Box
      sx={{
        marginY: '2%',
        paddingX: '1%',
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <Swiper
        spaceBetween={20}
        breakpoints={{
          300: {
            slidesPerView: 2.25,
          },
          700: {
            slidesPerView: 3.25,
          },
          1200: {
            slidesPerView: 4.25,
          },
        }}
        freeMode={{
          enabled: false,
          momentumVelocityRatio: 0.35,
        }}
        mousewheel={{ forceToAxis: true }}
        direction="horizontal"
      >
        {results.map((result) => (
          <SwiperSlide key={result.id}>
            <SearchResult
              result={result}
              query={query}
              closeModal={closeModal}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}
