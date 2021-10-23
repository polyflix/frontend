import { Video } from '@videos/models/video.model'

import {
  createGenericResourceSlice,
  GenericResourceState,
} from '@core/types/state.type'

export const videoSlice = createGenericResourceSlice({
  name: 'videos',
  initialState: {
    isLoading: false,
    data: [],
  } as GenericResourceState<Video>,
  reducers: {},
})

export const { start, success, error } = videoSlice.actions

export default videoSlice.reducer
