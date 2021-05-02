import { APP_DISPATCHER } from "@core/constants";
import { Inject, Injectable } from "@modules/di";
import { Dispatch } from "react";

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
    this.dispatcher(action);
  }
}
