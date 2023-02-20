import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit'

import { BaseModel } from '@core/models/base.model'

export interface GenericResourceState<T extends BaseModel> {
  isLoading: boolean
  data: T[]
  error?: Error
}

export const createGenericResourceSlice = <
  T extends BaseModel,
  Reducers extends SliceCaseReducers<GenericResourceState<T>>
>({
  name = '',
  initialState,
  reducers,
}: {
  name: string
  initialState: GenericResourceState<T>
  reducers: ValidateSliceCaseReducers<GenericResourceState<T>, Reducers>
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      ...reducers,
      /**
       * A basic action which should be called whenever the resource is fetched in order to toggle the loading state.
       * @param state the actual state
       */
      start: (state: GenericResourceState<T>) => {
        state.isLoading = true
      },
      /**
       * An action which should be called when the data was received to save it in the state.
       * @param state
       * @param action
       */
      success: (state: GenericResourceState<T>, action: PayloadAction<T[]>) => {
        state.data = action.payload
        state.isLoading = false
      },
      /**
       * An action which should be called when an error occured.
       * @param state
       * @param action
       */
      error: (state: GenericResourceState<T>, action: PayloadAction<Error>) => {
        state.error = action.payload
        state.isLoading = false
      },

      /**
       * An action which should be called when we want to add an item to our state.
       * @param state
       * @param action
       */
      addOne: (state: GenericResourceState<T>, action: PayloadAction<T>) => {
        state.data = [action.payload, ...state.data]
      },
    },
  })
}
