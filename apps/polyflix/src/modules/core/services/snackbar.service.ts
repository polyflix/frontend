import type {
  OptionsObject,
  ProviderContext as SnackbarContext,
  SnackbarKey,
  SnackbarMessage,
  VariantType,
} from 'notistack'
import type { TFunction } from 'react-i18next'

import { Inject, Injectable } from '@polyflix/di'

import { APP_SNACKBAR, APP_TRANSLATION } from '@core/constants/app.constant'
import { Endpoint } from '@core/constants/endpoint.constant'
import { CrudAction } from '@core/types/http.type'

/**
 * This service is used to create snackbars to notify the user.
 * @see https://mui.com/components/snackbars/
 */
@Injectable()
export class SnackbarService {
  constructor(
    @Inject(APP_SNACKBAR) private readonly snackbar: SnackbarContext,
    @Inject(APP_TRANSLATION) private readonly translate: TFunction
  ) {}

  /**
   * Display a snackbar into the UI with the message and options provided in parameters.
   * @param message the message to display in the Snackbar
   * @param options the options for the snackbar
   * @returns the snackbar key
   */
  public createSnackbar(
    message: SnackbarMessage,
    options?: OptionsObject
  ): SnackbarKey {
    return this.snackbar.enqueueSnackbar(message, {
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      ...options,
    })
  }

  /**
   * Notify the user with snackbars of an action.
   * @param action the action
   */
  public notify(
    action: CrudAction,
    endpoint: Endpoint,
    variant: VariantType = 'success'
  ): void {
    const translatedAction = this.translate(`snackbar.crudMessage`, {
      action: this.translate(`actions.${action}`, {
        ns: 'common',
      }),
      resource: this.translate(endpoint, {
        ns: 'resources',
      }),
    })
    this.createSnackbar(translatedAction, {
      variant,
    })
  }
}
