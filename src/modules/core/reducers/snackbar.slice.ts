import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum SnackBarType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface SnackBarState {
  isOpen: boolean
  name: string
  type?: SnackBarType
}

const initialState: SnackBarState = {
  isOpen: false,
  name: '',
}

export const snackBarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    displaySnackbar: (
      state,
      action: PayloadAction<{ name: string; type: SnackBarType }>
    ) => {
      state.isOpen = true
      state.name = action.payload.name
      state.type = action.payload.type
    },
  },
})

export const { displaySnackbar } = snackBarSlice.actions

export default snackBarSlice.reducer
