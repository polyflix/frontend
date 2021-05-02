import { StoreProvider } from "../types";
import { DependencyInjectionError } from "./di.error";

export class RecursiveProviderError extends DependencyInjectionError {
  constructor(requesters: StoreProvider[], depProvider: StoreProvider) {
    const circular: string = requesters
      .map((requester: StoreProvider) => requester.id.toString())
      .join(" => ");
    super(`
      DI recursive dependency: ${circular} => ${depProvider.id.toString()}.
    `);
  }
}
