import { createSlice } from '@reduxjs/toolkit'

export enum ServerHealth {
  UNKNOWN = 'unknown',
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
}

export interface ServerState {
  status: ServerHealth
}

const initialState: ServerState = {
  status: ServerHealth.UNKNOWN,
}

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    healthy: (state) => {
      state.status = ServerHealth.HEALTHY
    },
    unhealthy: (state) => {
      state.status = ServerHealth.UNHEALTHY
    },
  },
})

export const { healthy, unhealthy } = serverSlice.actions

export default serverSlice.reducer
