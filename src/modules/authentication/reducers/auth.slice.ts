import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IUser } from '@users/models/user.model'

export interface AuthState {
  isLoading: boolean
  user?: IUser
  token?: string
}

const initialState: AuthState = {
  isLoading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticationInProgress: (state) => {
      state.isLoading = true
    },
    /**
     * This method authenticate the user into the state.
     * @param state
     * @param action
     */
    authenticateUser: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoading = false
    },
    /**
     * This method log out the user from the state
     * @param state
     */
    logoutUser: (state) => {
      state.user = undefined
      state.token = undefined
    },
  },
})

export const { authenticateUser, logoutUser, authenticationInProgress } =
  authSlice.actions

export default authSlice.reducer
