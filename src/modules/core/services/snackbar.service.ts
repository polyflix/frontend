import { Injectable } from '@polyflix/di'

import { CrudAction } from '@core/types/http.type'

@Injectable()
export class SnackBarService {
  public displaySnackbar(ressource: string, action: CrudAction): void {
    // TODO display snackbar
    console.log('Display Snackbar', ressource, action)
  }
}
