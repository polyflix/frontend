import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import { StudioLayout } from './layouts/StudioLayout'
import { Home } from './pages/home/Home'
import { VideoRouter } from './pages/video/Video.routing'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<StudioLayout />}>
        <Route path="" element={<Home />} />
        <Route path="/video">{VideoRouter}</Route>
      </Route>
    </Route>
  )
)

export default router
