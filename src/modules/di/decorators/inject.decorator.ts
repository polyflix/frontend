import { Store } from "../store";
import { Injectable } from "../types";

export function Inject(injectable: Injectable): ParameterDecorator {
  return function (target: any, propertyKey: string | symbol, index: number) {
    Store.provider(target, { index, injectable });
  };
}
