import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from '@core/store'

import { Notes } from '@videos/models/notes.model'

const notesAdapter = createEntityAdapter<Notes>()

export const notesSlice = createSlice({
  name: 'notes',
  initialState: notesAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    notesUpdated: notesAdapter.updateOne,
  },
})

export const { notesUpdated } = notesSlice.actions

export const notesSelectors = notesAdapter.getSelectors(
  (state: RootState) => state.notes
)

export default notesSlice.reducer
