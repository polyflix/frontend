import { groupsApi } from '@admin/services/group.service'
import { configureStore } from '@reduxjs/toolkit'
import { subtitlesApi } from '@subtitles/services/subtitle.service'

import snackBarReducer from '@core/reducers/snackbar.slice'

import authReducer from '@auth/reducers/auth.slice'

import { quizzesAttemptsApi } from '@services/resources/attempt.service'
import { quizzesApi } from '@services/resources/quizz.service'

import notesReducer from '@videos/reducers/notes.slice'
import videosReducer from '@videos/reducers/video.slice'
import { notesApi } from '@shared/services/resources/videos/notes.service'
import { videosApi } from '@shared/services/resources/videos/video.service'

import { attachmentsApi } from '@attachments/services/attachment.service'

import { collectionsApi as modulesApi } from '@collections/services/collection.service'

import { coursesApi } from '@shared/services/resources/course.service'

import usersReducer from '@users/reducers/user.slice'
import { usersApi } from '@users/services/user.service'

import { certificationsApi } from '@certifications/services/certification.service'

import uploadReducer from './reducers/file-upload.slice'
import serverReducer from './reducers/server.slice'
import { api } from '../../shared/services/api.service'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
    [certificationsApi.reducerPath]: certificationsApi.reducer,
    [subtitlesApi.reducerPath]: subtitlesApi.reducer,
    [quizzesApi.reducerPath]: quizzesApi.reducer,
    [quizzesAttemptsApi.reducerPath]: quizzesAttemptsApi.reducer,
    [modulesApi.reducerPath]: modulesApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [attachmentsApi.reducerPath]: attachmentsApi.reducer,
    auth: authReducer,
    server: serverReducer,
    videos: videosReducer,
    notes: notesReducer,
    users: usersReducer,
    snackbar: snackBarReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(videosApi.middleware)
      .concat(usersApi.middleware)
      .concat(notesApi.middleware)
      .concat(certificationsApi.middleware)
      .concat(subtitlesApi.middleware)
      .concat(quizzesApi.middleware)
      .concat(quizzesAttemptsApi.middleware)
      .concat(modulesApi.middleware)
      .concat(coursesApi.middleware)
      .concat(groupsApi.middleware)
      .concat(attachmentsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
