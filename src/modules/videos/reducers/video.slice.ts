import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import { RootState } from '@core/store'

import { Video } from '@videos/models/video.model'

const videosAdapter = createEntityAdapter<Video>({
  selectId: (video) => video.slug,
  sortComparer: (a, b) => {
    return dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? -1 : 1
  },
})

export const videoSlice = createSlice({
  name: 'videos',
  initialState: videosAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    videoAdded: videosAdapter.addOne,
    videoUpdated: videosAdapter.updateOne,
    videosReceived: (state, action) => {
      videosAdapter.setAll(state, action.payload)
      state.loading = false
    },
    videosLoading: (state) => {
      state.loading = false
    },
  },
})

export const { videoAdded, videosLoading, videosReceived, videoUpdated } =
  videoSlice.actions

export const videosSelectors = videosAdapter.getSelectors(
  (state: RootState) => state.videos
)

export default videoSlice.reducer
