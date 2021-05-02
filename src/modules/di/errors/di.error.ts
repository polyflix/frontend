import { Injectable, StoreProvider, Type } from "../types";

export function id(injectable: StoreProvider | Injectable): string {
  if (injectable === undefined) {
    return "undefined";
  }

  if ((injectable as StoreProvider).id) {
    return (injectable as StoreProvider).id.toString();
  }

  return (injectable as Type).name || injectable.toString();
}

export class DependencyInjectionError extends Error {
  name!: string;
  message!: string;

  constructor(message: string) {
    super(message);

    Object.defineProperty(this, "name", {
      value: this.constructor.name,
    });

    (Error as any).captureStackTrace(this, this.constructor);
  }
}
