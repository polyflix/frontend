import { Mock } from "./generic";
import { BaseUsers, User } from "./user";
import { faker } from "@faker-js/faker";
import { Factory, Model, Server } from "miragejs";
import {
  AnyRegistry,
  FactoryDefinition,
  ModelDefinition,
} from "miragejs/-types";

export interface Page {
  title: string;
  content: string;
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class PageMock implements Mock {
  name(): string {
    return "page";
  }

  routes(server: Server<AnyRegistry>): void {
    server.timing = 1000;
    server.get("pages/:id", (schema, request) => {
      return schema.findBy("page", { id: request.params.id });
    });

    server.post("pages", (schema, request) => {
      const attrs = JSON.parse(request.requestBody);
      return schema.create("page", attrs);
    });

    server.put("pages/:id", (schema, request) => {
      const attrs = JSON.parse(request.requestBody);
      schema.findBy("page", { id: request.params.id })?.update(attrs);
      return schema.findBy("page", { id: request.params.id });
    });

    server.delete("pages/:id", (schema, request) => {
      const page = schema.findBy("page", { id: request.params.id });
      page?.destroy();
      return page;
    });
  }

  factory(): FactoryDefinition<{}> {
    return Factory.extend({
      id() {
        return faker.datatype.uuid();
      },

      title() {
        return faker.name.jobTitle();
      },
      content() {
        return faker.lorem.lines(5);
      },
      userId() {
        return BaseUsers[0].id;
      },
      createdAt() {
        return faker.date.past(2);
      },
      updatedAt() {
        return faker.date.recent(1);
      },
    });
  }

  seeds(server: Server<AnyRegistry>): void {
    server.createList(this.name(), 20);
  }

  model(): ModelDefinition {
    return Model.extend({});
  }
}
