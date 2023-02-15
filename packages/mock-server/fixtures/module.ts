import { Mock } from "./generic";
import { BaseUsers, User } from "./user";
import { faker } from "@faker-js/faker";
import { Factory, Model, Server } from "miragejs";
import {
  AnyRegistry,
  FactoryDefinition,
  ModelDefinition,
} from "miragejs/-types";
import { BaseModel } from "./generic";
import { readableVideo, Video } from "./video";

export interface Module extends BaseModel {
  description: string;
  name: string;
  slug: string;
  elements?: Element[];
  passwords?: string[];
  user?: User;
  userId?: string;
  visibility?: string;
  draft?: boolean;
}

export interface Element extends Video {
  type: string;
  order: number;
  name: string;
}

export class ModuleMock implements Mock {
  name(): string {
    return "course";
  }

  routes(server: Server<AnyRegistry>): void {
    server.timing = 1000;

    server.get("modules", (schema, request) => {
      const { pageSize } = request.queryParams;
      const { models } = (schema as any).courses.all();
      return {
        data: models.slice(0, pageSize ?? 100),
        total: models.length,
      };
    });

    server.get("modules/:slug", (schema, request) => {
      return readableModule;
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
    });
  }

  seeds(server: Server<AnyRegistry>): void {
    server.createList(this.name(), 20);
  }

  model(): ModelDefinition {
    return Model.extend({});
  }
}

export const readableModule: Module = {
  createdAt: "2022-06-12T20:53:51.581Z",
  description: "TODO",
  draft: false,
  elements: [
    { order: 0, type: "video", name: readableVideo.title, ...readableVideo },
    { order: 0, type: "quizz", name: readableVideo.title, ...readableVideo },
    { order: 0, type: "quizz", name: readableVideo.title, ...readableVideo },
    { order: 0, type: "video", name: readableVideo.title, ...readableVideo },
    { order: 0, type: "video", name: readableVideo.title, ...readableVideo },
    { order: 0, type: "video", name: readableVideo.title, ...readableVideo },
  ],
  id: "644bcb05-5978-4fc9-93bf-6dfc2c0c9e77",
  name: "Polycloud - Amphithéâtre Peytavin",
  passwords: [],
  slug: "polycloud-amphitheatre-peytavin--z5ubit",
  updatedAt: "2022-06-12T20:53:51.581Z",
  user: BaseUsers[0],
  userId: BaseUsers[0].id,
  visibility: "public",
  __v: 1,
};
