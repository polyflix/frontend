import { Container } from "../container";
import { Injectable } from "../types";

/**
 * Get a provider for the DI system.
 *
 * @template T
 * @param {Injectable} injectable
 * @returns {T} the provider
 */
export const useInjection = <T>(injectable: Injectable): T => {
  const provider = Container.get<T>(injectable);
  return provider;
};
