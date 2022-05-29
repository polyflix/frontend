import { configureStore } from '@reduxjs/toolkit'
import { subtitlesApi } from '@subtitles/services/subtitle.service'

import snackBarReducer from '@core/reducers/snackbar.slice'

import authReducer from '@auth/reducers/auth.slice'

import videosReducer from '@videos/reducers/video.slice'
import { videosApi } from '@videos/services/video.service'

import usersReducer from '@users/reducers/user.slice'
import { usersApi } from '@users/services/user.service'

import uploadReducer from './reducers/file-upload.slice'
import serverReducer from './reducers/server.slice'
import { api } from './services/api.service'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [subtitlesApi.reducerPath]: subtitlesApi.reducer,
    auth: authReducer,
    server: serverReducer,
    videos: videosReducer,
    users: usersReducer,
    snackbar: snackBarReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(videosApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
