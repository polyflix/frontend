import { InjectionToken } from "./models/injection-token.model";
import { Reflector } from "./reflector";
import {
  Dependency,
  Injectable,
  InjectableId,
  StoreProvider,
  Type,
} from "./types";

export class Store {
  public static providers: StoreProvider[] = [];

  /**
   * Get the provider id
   *
   * @param {Injectable} injectable
   * @returns {InjectableId}
   */
  public static providerId(injectable: Injectable): InjectableId | null {
    if (!injectable) return null;

    if (
      typeof injectable === "string" ||
      injectable instanceof InjectionToken
    ) {
      return injectable;
    }

    return Reflector.getId(injectable);
  }

  /**
   * Register provider
   */
  public static provider(
    type: Type,
    args?: { injectable?: any; optional?: any; index?: any }
  ): Type {
    let provider: StoreProvider = this.findProvider(type);

    if (!provider) {
      provider = this.createProvider(type);
    }

    if (!args) {
      Reflector.paramTypes(type).forEach((param: Injectable, index: number) => {
        if (!provider.deps![index] || !provider.deps![index].id) {
          provider.deps![index] = {
            id: this.providerId(param) as InjectableId,
          };
        }
      });

      return type;
    }

    const dep: Dependency = provider.deps![args.index] || { id: null };

    provider.deps![args.index] = {
      id: args.injectable
        ? (this.providerId(args.injectable) as InjectableId)
        : dep.id,
      optional: args.optional || dep.optional,
    };

    return type;
  }

  /**
   * Find a provider
   * @param {Injectable} injectable
   * @returns {StoreProvider} the store provider
   */
  public static findProvider(injectable: Injectable): StoreProvider {
    const id: InjectableId = this.providerId(injectable)!;

    return this.providers.find(
      (provider: StoreProvider) => provider.id === id
    )!;
  }

  /**
   * Replace stored provider with new provider
   * @param {Injectable} injectable
   * @param {StoreProvider} provider
   */
  public static replaceProvider(
    injectable: Injectable,
    provider: StoreProvider
  ): void {
    const storeProvider: StoreProvider = this.findProvider(injectable);
    const index: number = this.providers.indexOf(storeProvider);

    if (index !== -1) {
      this.providers[index] = provider;
    } else {
      this.providers.push(provider);
    }
  }

  /**
   * Create and store provider
   *
   * @returns {StoreProvider}
   */
  private static createProvider(type: Type): StoreProvider {
    const id: InjectableId = Reflector.setId(type);
    const storeProvider: StoreProvider = { id, type, deps: [] };

    this.providers.push(storeProvider);

    return storeProvider;
  }
}
