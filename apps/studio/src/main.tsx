import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeConfig, GlobalStyles } from 'theme'
import { RouterProvider } from 'react-router-dom'
import mainRouter from './main.routing'
import { initMockServer } from 'mock-server'
import { QueryClient, QueryClientProvider } from 'react-query'

initMockServer()

const StudioApp = () => {
  return <RouterProvider router={mainRouter} />
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={'Loading'}>
      <QueryClientProvider client={queryClient}>
        <ThemeConfig>
          <GlobalStyles />
          <StudioApp />
        </ThemeConfig>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
)
