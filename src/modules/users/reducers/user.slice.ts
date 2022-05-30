import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from '@core/store'

import { User } from '@users/models/user.model'

const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
})

export const userSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    userUpdated: usersAdapter.updateOne,
    usersReceived: (state, action) => {
      usersAdapter.setAll(state, action.payload)
      state.loading = false
    },
    usersLoading: (state) => {
      state.loading = false
    },
  },
})

export const { usersLoading, usersReceived, userUpdated } = userSlice.actions

export const usersSelectors = usersAdapter.getSelectors(
  (state: RootState) => state.users
)

export default userSlice.reducer
