import { InjectionToken } from "./models/injection-token.model";

/**
 * Injectable type
 */
export type Injectable = Type | InjectableId;

/**
 * Injectable identifier
 */
export type InjectableId = InjectionToken | string;

/**
 * Registered provider in the store
 *
 * @interface StoreProvider
 */
export interface StoreProvider {
  id: InjectableId;
  deps?: Dependency[];
  type?: Type;
  factory?: Factory;
  value?: any;
}

/**
 * Class provider
 * @example
 * [
 *   ServiceProvider
 * ]
 *
 * @interface ClassProvider
 */
export interface ClassProvider {
  provide: Injectable;
  useClass: Type;
  deps?: Injectable[];
}

/**
 * Factory provider
 *
 * @example
 * [
 *   { provide: TOKEN, useFactory: () => service, deps: [] }
 * ]
 *
 * @interface FactoryProvider
 */
export interface FactoryProvider {
  provide: Injectable;
  useFactory: Factory;
  deps?: Injectable[];
}

/**
 * Value provider
 *
 * @example
 * [
 *  { provide: 'apiKey', useValue: "API KEY VALUE" }
 * ]
 *
 * @interface ValueProvider
 */
export interface ValueProvider {
  provide: Injectable;
  useValue: any;
}

/**
 * Injectable dependency
 *
 * @interface Dependency
 */
export interface Dependency {
  id: InjectableId;
  optional?: boolean;
}

/**
 * Dependency injection system provider
 *
 * @type Provider
 */
export type Provider = ClassProvider | FactoryProvider | ValueProvider;

/**
 * Generic interface for the class
 *
 * @interface Type
 */
export interface Type {
  new (...args: any[]): any;
}

/**
 * Generic factory function type
 * @type Factory
 */
export type Factory = (...args: any[]) => any;
