import { Store } from "../store";

export function Injectable() {
  return function (target: any): any {
    return Store.provider(target);
  };
}
