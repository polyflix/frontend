import { useSnackbar } from 'notistack'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Container, Provider } from '@polyflix/di'

import {
  APP_DISPATCHER,
  APP_SNACKBAR,
  APP_TRANSLATION,
} from '@core/constants/app.constant'

type DIProviderProps = {
  providers?: Provider[]
}
/**
 * A simple component that can accepts an array of providers in props in order
 * to provide them in the store.
 */
export const DIProvider: React.FC<PropsWithChildren<DIProviderProps>> = ({
  providers,
  children,
}) => {
  const dispatch = useDispatch()
  const snackbarContext = useSnackbar()
  const { t } = useTranslation()

  const defaultProviders: Provider[] = [
    { provide: APP_DISPATCHER, useValue: dispatch },
    { provide: APP_SNACKBAR, useValue: snackbarContext },
    { provide: APP_TRANSLATION, useValue: t },
  ]

  Container.provide([...(providers || []), ...defaultProviders])

  return <>{children}</>
}
