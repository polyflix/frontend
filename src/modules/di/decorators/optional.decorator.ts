import { Store } from "../store";

export function Optional(): ParameterDecorator {
  return function (target: any, key: string | symbol, index: number): void {
    Store.provider(target, { index, optional: true });
  };
}
