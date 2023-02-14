import { Mock } from "./generic";
import { BaseUsers, User } from "./user";
import { faker } from "@faker-js/faker";
import { Factory, Model, Server } from "miragejs";
import {
  AnyRegistry,
  FactoryDefinition,
  ModelDefinition,
} from "miragejs/-types";

export interface Watchtime {
  videoId: string;
  userId?: string;
  watchedSeconds: number;
  watchedPercent: number;
  isWatched: boolean;
}

export interface Course {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  visibility?: string;
  draft?: boolean;
  name: string;
  slug: string;
  description: string;
  content: string;
  user?: User;
  modules?: any[]; // TODO
}

export class CourseMock implements Mock {
  name(): string {
    return "course";
  }

  routes(server: Server<AnyRegistry>): void {
    server.timing = 1000;

    server.get("courses", (schema, request) => {
      const { pageSize } = request.queryParams;
      const { models } = (schema as any).courses.all();
      return {
        data: models.slice(0, pageSize ?? 100),
        total: models.length,
      };
    });

    server.get("courses/:id", (schema) => {
      return schema.first("course");
    });
  }

  factory(): FactoryDefinition<{}> {
    return Factory.extend({
      id() {
        return faker.datatype.uuid();
      },
      slug() {
        return faker.datatype.uuid();
      },
      name() {
        return faker.name.jobTitle();
      },
      description() {
        return faker.lorem.lines(5);
      },
      user() {
        return BaseUsers[0];
      },
      visibility() {
        return Math.random() > 0.2 ? "public" : "private";
      },
      draft() {
        return Math.random() < 0.4;
      },
      createdAt() {
        return faker.date.past(2);
      },
      updatedAt() {
        return faker.date.recent(1);
      },
      content() {
        return faker.lorem.lines(5);
      },
      modules() {
        return new Array(faker.datatype.number(1)).fill(0);
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
