import { Inject, Injectable } from '@polyflix/di'
import { Dispatch } from 'react'
import { APP_DISPATCHER } from '../constants/injection.constant'

@Injectable()
export class ReduxService<T> {
  constructor(
    @Inject(APP_DISPATCHER) private readonly dispatcher: Dispatch<T>
  ) {}

  /**
   * Dispatch an action in the redux store.
   *
   * @template T
   * @param {T} action the action to dispatch
   */
  public dispatch(action: T): void {
    this.dispatcher(action)
  }
}
