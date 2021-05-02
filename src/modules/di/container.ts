import { MissingProviderError, RecursiveProviderError } from "./errors";
import { Store } from "./store";
import {
  ClassProvider,
  Dependency,
  Factory,
  FactoryProvider,
  Injectable,
  InjectableId,
  Provider,
  StoreProvider,
  ValueProvider,
} from "./types";

export class Container {
  /**
   * Register providers into the store.
   * @param {Provider[]} providers the providers to register.
   */
  static provide(providers: Provider[]) {
    providers
      .filter((provider) => (provider as ClassProvider).useClass)
      .forEach((provider) =>
        this.registerClassProvider(provider as ClassProvider)
      );

    providers
      .filter((provider) => (provider as FactoryProvider).useFactory)
      .forEach((provider) =>
        this.registerFactoryProvider(provider as FactoryProvider)
      );

    providers
      .filter((provider) => (provider as ValueProvider).useValue)
      .forEach((provider) =>
        this.registerValueProvider(provider as ValueProvider)
      );
  }

  /**
   * Resolve a provider from the store.
   *
   * @template T
   * @param {Injectable} injectable the key to retrieve the provider
   * @returns {T} the provider
   */
  public static get<T>(injectable: Injectable): T {
    const provider: StoreProvider = Store.findProvider(injectable);

    if (!provider) {
      throw new MissingProviderError(injectable);
    }

    return this.resolveProvider(provider);
  }

  /**
   * Resolve a provider and it's dependencies.
   *
   * @param {StoreProvider} provider
   * @param {StoreProvider[]} requesters
   * @returns the provider resolved.
   */
  private static resolveProvider(
    provider: StoreProvider,
    requesters: StoreProvider[] = []
  ): any {
    if (provider.value) {
      return provider.value;
    }

    const _requesters = requesters.concat([provider]);

    const deps = provider.deps!.map((dep: Dependency) => {
      const requesterProvider = _requesters.find(
        (requester: StoreProvider) => requester.id === dep.id
      );

      if (requesterProvider) {
        throw new RecursiveProviderError(_requesters, requesterProvider);
      }

      const depService: StoreProvider = Store.findProvider(dep.id);

      if (!depService && !dep.optional) {
        throw new MissingProviderError(provider, dep);
      }

      if (!depService && dep.optional) {
        return null;
      }

      return this.resolveProvider(depService, _requesters);
    });

    provider.value = provider.factory
      ? provider.factory(...deps)
      : new provider.type!(...deps);

    return provider.value;
  }

  /**
   * Register a class provider
   * @param provider
   */
  private static registerClassProvider(provider: ClassProvider): void {
    const id: InjectableId = Store.providerId(provider.provide)!;
    const classProvider: StoreProvider = Store.findProvider(provider.useClass);
    const deps: Dependency[] = (classProvider
      ? classProvider.deps
      : (provider.deps || []).map(
          (dep: Injectable): Dependency => ({
            id: Store.providerId(dep)!,
          })
        ))!;

    Store.replaceProvider(provider.provide, {
      id,
      deps,
      type: provider.useClass,
    });
  }

  /**
   * Register factory provider
   *
   * @param {FactoryProvider} provider
   */
  private static registerFactoryProvider(provider: FactoryProvider): void {
    const id: InjectableId = Store.providerId(provider.provide)!;
    const factory: Factory = provider.useFactory;
    const deps: Dependency[] = (provider.deps || []).map(
      (dep: Injectable): Dependency => ({
        id: Store.providerId(dep)!,
      })
    )!;

    Store.replaceProvider(provider.provide, { id, factory, deps });
  }

  /**
   * Register value provider
   *
   * @param {ValueProvider} provider
   * @memberof Container
   */
  private static registerValueProvider(provider: ValueProvider): void {
    const id: InjectableId = Store.providerId(provider.provide)!;
    const value: any = provider.useValue;

    Store.replaceProvider(provider.provide, { id, value });
  }
}
