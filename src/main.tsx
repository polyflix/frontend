import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Provider } from 'react-redux'

import { DIProvider } from '@core/components/DIProvider/DIProvider'
import { store } from '@core/redux/store'

import { GlobalStyles } from '@theme/globalStyles'
import { ThemeConfig } from '@theme/theme'

import './i18n/config'
import './styles/index.scss'

const PolyflixApp = () => {
  const { t } = useTranslation()

  return (
    <Provider store={store}>
      <DIProvider>
        <ThemeConfig>
          <GlobalStyles />
          <h1>{t('home')}</h1>
        </ThemeConfig>
      </DIProvider>
    </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <PolyflixApp />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('application')
)
