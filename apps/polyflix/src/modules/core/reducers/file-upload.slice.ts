import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FileUploadState {
  isUploading: boolean
  file?: File
  progress?: number
}

const initialState: FileUploadState = {
  isUploading: false,
}

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    /**
     * An action that should be called when an upload start
     * @param state
     */
    start: (state) => {
      state.isUploading = true
    },

    /**
     * An action that should be called when an upload end
     * @param state
     */
    end: (state) => {
      state.isUploading = false
    },
    /**
     * Action that should be called when the user uploads a file
     * @param state
     * @param action
     */
    setProgress: (
      state,
      action: PayloadAction<{ file: File; progress: number }>
    ) => {
      state.file = action.payload.file
      state.progress = action.payload.progress
    },

    /**
     * Action that should be called when the user ends to uploads files
     * @param state
     */
    resetProgress: (state) => {
      state.file = undefined
      state.progress = undefined
    },
  },
})

export const { setProgress, resetProgress, end, start } = uploadSlice.actions

export default uploadSlice.reducer
