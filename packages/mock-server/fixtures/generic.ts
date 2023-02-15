import { Server } from "miragejs";
import { FactoryDefinition, ModelDefinition } from "miragejs/-types";

export interface BaseModel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Mock {
  name(): string;
  /**
   * Configure routes for the current mock entity
   */
  routes(config: Server): void;
  /**
   * Return the factory defintion for the mock entity
   */
  factory(): FactoryDefinition;
  /**
   * Return the model defintion for the mock entity
   */
  model(): ModelDefinition;
  /**
   * Generate the seeds for the current mock entity
   */
  seeds(config: Server): void;
}
