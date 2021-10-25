import { configureStore } from '@reduxjs/toolkit'

import snackBarReducer from '@core/reducers/snackbar.slice'

import authReducer from '@auth/reducers/auth.slice'

import videosReducer from '@videos/reducers/video.slice'

import uploadReducer from './reducers/file-upload.slice'
import serverReducer from './reducers/server.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    videos: videosReducer,
    snackbar: snackBarReducer,
    upload: uploadReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
