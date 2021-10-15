import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IUser } from '@users/models/user.model'

export interface AuthState {
  /**
   * A boolean to check if the auth is currently loading
   */
  isLoading: boolean
  /**
   * A boolean to control the refresh auth to avoid useless API calls
   */
  hasRefreshedAuth: boolean
  /**
   * The logged in user. By default, this is undefined.
   */
  user?: IUser
  /**
   * The access token of the user used by the HttpService to authenticate requests.
   */
  token?: string
}

const initialState: AuthState = {
  isLoading: false,
  hasRefreshedAuth: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticationFailed: (state) => {
      state.isLoading = false
    },
    authenticationInProgress: (state) => {
      state.isLoading = true
      state.hasRefreshedAuth = true
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

export const {
  authenticateUser,
  logoutUser,
  authenticationInProgress,
  authenticationFailed,
} = authSlice.actions

export default authSlice.reducer
