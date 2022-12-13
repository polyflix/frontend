import { Mock } from "./generic";
import { AnyRegistry, FactoryDefinition, ModelDefinition } from "miragejs/-types";
import { Factory, Model, Server } from "miragejs";

export class SearchMock implements Mock {
  name(): string {
    return "search";
  }

  routes(server: Server<AnyRegistry>): void {
    server.get("search", () => {
       return {};
    });
  }

  factory(): FactoryDefinition<{}> {
    return Factory.extend({});
  }

  seeds(server: Server<AnyRegistry>): void {}

  model(): ModelDefinition {
    return Model.extend({});
  }
}
