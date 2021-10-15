import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@auth/reducers/auth.slice'

import serverReducer from './reducers/server.reducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
