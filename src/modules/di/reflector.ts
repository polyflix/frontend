import "reflect-metadata";
import { InjectionToken } from "./models/injection-token.model";
import { Injectable, Type } from "./types";

const METADATA_KEY = "__meta_di__";

export class Reflector {
  /**
   * Get the identifier from metadata for the type
   * @param {Type} type
   * @returns {InjectionToken} the injection token
   */
  public static getId(type: Type): InjectionToken {
    return Reflect.getMetadata(METADATA_KEY, type);
  }

  /**
   * Set the identifier for the type in the metadata.
   * @param {Type} type
   * @returns {InjectionToken} the injection token
   */
  public static setId(type: Type): InjectionToken {
    const id: InjectionToken = new InjectionToken(type.name);

    Reflect.defineMetadata(METADATA_KEY, id, type);

    return id;
  }

  /**
   * Get the param types for the target
   * @param {Type} target
   * @returns {Injectable[]} all injectables
   */
  public static paramTypes(target: Type): Injectable[] {
    return Reflect.getMetadata("design:paramtypes", target) || [];
  }
}
