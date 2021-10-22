import { configureStore } from '@reduxjs/toolkit'
import videosReducer from '@videos/reducers/video.slice'

import snackBarReducer from '@core/reducers/snackbar.slice'

import authReducer from '@auth/reducers/auth.slice'

import serverReducer from './reducers/server.reducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    snackbar: snackBarReducer,
    videos: videosReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
