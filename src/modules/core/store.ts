import { configureStore } from '@reduxjs/toolkit'
import { subtitlesApi } from '@subtitles/services/subtitle.service'

import snackBarReducer from '@core/reducers/snackbar.slice'

import authReducer from '@auth/reducers/auth.slice'

import { quizzesAttemptsApi } from '@quizzes/services/attempt.service'
import { quizzesApi } from '@quizzes/services/quizz.service'

import videosReducer from '@videos/reducers/video.slice'
import { videosApi } from '@videos/services/video.service'

import { collectionsApi as modulesApi } from '@collections/services/collection.service'

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
    [quizzesApi.reducerPath]: quizzesApi.reducer,
    [quizzesAttemptsApi.reducerPath]: quizzesAttemptsApi.reducer,
    [modulesApi.reducerPath]: modulesApi.reducer,
    auth: authReducer,
    server: serverReducer,
    videos: videosReducer,
    users: usersReducer,
    snackbar: snackBarReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(videosApi.middleware)
      .concat(usersApi.middleware)
      .concat(subtitlesApi.middleware)
      .concat(quizzesApi.middleware)
      .concat(quizzesAttemptsApi.middleware)
      .concat(modulesApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
