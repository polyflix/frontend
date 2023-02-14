import { Mock } from "./generic";
import { BaseUsers, User } from "./user";
import { faker } from "@faker-js/faker";
import { Factory, Model, Server } from "miragejs";
import {
  AnyRegistry,
  FactoryDefinition,
  ModelDefinition,
} from "miragejs/-types";

export interface Notes {
  id: string;
  userId: string;
  description: string;
  videoId: string;
  content: string;
}

export class NoteMock implements Mock {
  name(): string {
    return "note";
  }

  routes(server: Server<AnyRegistry>): void {
    server.timing = 1000;

    server.get("notes/:id", () => {
      return readableVideo;
    });

    server.put("notes/:id");
  }

  factory(): FactoryDefinition<{}> {
    return Factory.extend({
      id() {
        return faker.datatype.uuid();
      },
      userId() {
        return faker.datatype.uuid();
      },
      description() {
        return faker.lorem.lines(5);
      },
      videoId() {
        return faker.datatype.uuid();
      },
      content() {
        return faker.lorem.lines(5);
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

const readableVideo: Notes = {
  id: "50d4ec43-4e66-48ff-9149-d6678243815c",
  userId: "50d4ec43-4e66-48ff-9149-d6678243815c",
  content: "#### Hello World from mock server",
  description: "lorem ipsum",
  videoId: "50d4ec43-4e66-48ff-9149-d6678243815c",
};
