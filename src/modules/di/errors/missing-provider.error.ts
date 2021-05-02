import { Dependency, Injectable, StoreProvider } from "../types";
import { DependencyInjectionError, id } from "./di.error";

export class MissingProviderError extends DependencyInjectionError {
  constructor(provider: StoreProvider | Injectable, dep?: Dependency) {
    super(
      dep
        ? `
          In order to get DI working, you have to provide Injectable.
          DI attempt for ${id(provider)} and dependency ${id(dep)}.
        `
        : `
          In order to get DI working, you have to provide Injectable.
          DI attempt for ${id(provider)}.
        `
    );
  }
}
