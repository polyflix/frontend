import { Suspense, lazy } from 'react'
import { Route } from 'react-router-dom'
import { LoadingFallback } from '../../components/loading-fallback.component'
import { VideoLayout } from './Video.layout'

const VideoView = lazy(() => import('./view/VideoView'))
const VideoForm = lazy(() => import('./form/VideoForm'))
const Video = lazy(() => import('./Video'))

export const VideoRouter = (
  <Route path="" element={<VideoLayout />}>
    <Route
      path=""
      element={
        <Suspense fallback={<LoadingFallback />}>
          <Video />
        </Suspense>
      }
    />
    <Route
      path="view/:id"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <VideoView />
        </Suspense>
      }
    />
    <Route
      path="form/:id"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <VideoForm />
        </Suspense>
      }
    />
    <Route
      path="form"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <VideoForm />
        </Suspense>
      }
    />
  </Route>
)
