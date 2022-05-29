import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User } from '@users/models/user.model'

export interface AuthState {
  /**
   * A boolean to check if the auth is currently loading
   */
  isLoading: boolean
  /**
   * A boolean to check if the auth is refreshing
   */
  isAuthRefreshing: boolean
  /**
   * A boolean to control the refresh auth to avoid useless API calls
   */
  hasRefreshedAuth: boolean
  /**
   * The logged in user. By default, this is undefined.
   */
  user?: User
  /**
   * The access token of the user used by the HttpService to authenticate requests.
   */
  token?: string
}

const initialState: AuthState = {
  isLoading: false,
  isAuthRefreshing: true,
  hasRefreshedAuth: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Action called when the app tries to refresh the user authentication.
     * @param state
     */
    refreshAuthInProgress: (state) => {
      state.hasRefreshedAuth = true
      state.isAuthRefreshing = true
    },
    /**
     * Action called when the app failed to refresh the user authentication
     * @param state
     */
    refreshAuthFailed: (state) => {
      state.isAuthRefreshing = false
    },
    /**
     * Action called when the app failed to authenticate the user
     * @param state
     */
    authenticationFailed: (state) => {
      state.isLoading = false
    },
    /**
     * Action called when the app is currently authenticating the user
     * @param state
     */
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
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoading = false
      state.isAuthRefreshing = false
    },
    /**
     * This method set the user in payload as current user.
     * @param state
     * @param action
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
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
  refreshAuthFailed,
  refreshAuthInProgress,
  setUser,
} = authSlice.actions

export default authSlice.reducer
