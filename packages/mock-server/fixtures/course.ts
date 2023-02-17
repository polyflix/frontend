import { faker } from "@faker-js/faker";
import { Factory, Model, Server } from "miragejs";
import {
  AnyRegistry,
  FactoryDefinition,
  ModelDefinition,
} from "miragejs/-types";
import { Mock } from "./generic";
import { BaseUsers, User } from "./user";

export enum VISIBILITY {
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
  PRIVATE = "PRIVATE",
}

export interface Course {
  title: string;
  description: string;
  visibility: VISIBILITY;
  sections: Section[];
  id: string;
  userId: string;
  user?: User; // INJECTED BY AGGREGATOR
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  title: string;
  elements: Element[];
  id: string;
}

export interface Element {
  type: "VIDEO" | "PAGE" | "QUIZ";
  id: string;
  order: number;
}

export class CourseMock implements Mock {
  name(): string {
    return "course";
  }

  routes(server: Server<AnyRegistry>): void {
    server.timing = 1000;

    server.get("courses", (schema, request) => {
      const { pageSize, page, visibility, userId } = request.queryParams;
      const { models } = (schema as any).courses.all();

      return {
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 10,
        total: models.length,
        data: models
          .filter((course: Course) => {
            if (visibility && course.visibility !== visibility) {
              return false;
            }
            if (userId && course.userId !== userId) {
              return false;
            }
            return true;
          })
          .slice(0, parseInt(pageSize) || 10),
      };
    });

    server.get("courses/:id", (schema) => {
      return schema.first("course");
    });

    server.post("courses", (schema, request) => {
      const attrs = JSON.parse(request.requestBody);
      return schema.create("course", attrs);
    });

    server.put("courses/:id", (schema, request) => {
      const attrs = JSON.parse(request.requestBody);
      schema.findBy("course", { id: request.params.id })?.update(attrs);
      return schema.findBy("course", { id: request.params.id });
    });

    server.delete("courses/:id", (schema, request) => {
      const course = schema.findBy("course", { id: request.params.id });
      course?.destroy();
      return course;
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
      description() {
        return faker.lorem.lines(5);
      },
      userId() {
        return BaseUsers[0].id;
      },
      user() {
        // INJECTED BY AGGREGATOR
        return BaseUsers[0];
      },
      visibility() {
        return Math.random() > 0.2 ? "PUBLIC" : "PRIVATE";
      },
      content() {
        return faker.lorem.lines(5);
      },
      sections() {
        return [
          {
            id: faker.datatype.uuid(),
            title: faker.name.jobTitle(),
            elements: [
              {
                type: "VIDEO",
                id: faker.datatype.uuid(),
                order: 0,
              },
              {
                type: "PAGE",
                id: faker.datatype.uuid(),
                order: 1,
              },
              {
                type: "QUIZ",
                id: faker.datatype.uuid(),
                order: 2,
              },
            ],
          },
          {
            id: faker.datatype.uuid(),
            title: faker.name.jobTitle(),
            elements: [
              {
                type: "VIDEO",
                id: faker.datatype.uuid(),
                order: 0,
              },
              {
                type: "PAGE",
                id: faker.datatype.uuid(),
                order: 1,
              },
              {
                type: "VIDEO",
                id: faker.datatype.uuid(),
                order: 2,
              },
            ],
          },
        ];
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
