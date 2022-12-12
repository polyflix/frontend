import { Factory, Model, Server } from "miragejs";
import {
  AnyRegistry,
  FactoryDefinition,
  ModelDefinition,
} from "miragejs/-types";
import { faker } from "@faker-js/faker";
import { Mock } from "./generic";

export enum Roles {
  ADMINISTRATOR = "ADMINISTRATOR",
  CONTRIBUTOR = "CONTRIBUTOR",
  MEMBER = "MEMBER",
}

export interface User {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  roles: Roles[];
}

export class UserMock implements Mock {
  name(): string {
    return "user";
  }

  routes(server: Server<AnyRegistry>): void {
    server.get("users", (schema) => {
      const { models } = (schema as any).users.all();
      return {
        currentPage: 0,
        data: models,
        totalElements: models.length,
        totalPages: 1,
      };
    });

    server.get("users/:id", (schema, request) => {
      const { attrs } = (schema as any).users.find(request.params.id);
      return attrs;
    });
  }

  factory(): FactoryDefinition<{}> {
    return Factory.extend({
      id() {
        return faker.datatype.uuid();
      },
      avatar() {
        return `https://avatars.dicebear.com/api/identicon/${faker.datatype.uuid()}.svg`;
      },
      email() {
        return faker.internet.email();
      },
      firstName() {
        return faker.name.firstName();
      },
      lastName() {
        return faker.name.lastName();
      },
      username() {
        return faker.internet.userName();
      },
      roles() {
        return [Roles.MEMBER];
      },
    });
  }

  seeds(server: Server<AnyRegistry>): void {
    server.create(this.name(), memberUser);
    server.create(this.name(), contributorUser);
    server.create(this.name(), adminUser);

    server.createList(this.name(), 20);
  }

  model(): ModelDefinition {
    return Model.extend({});
  }
}

const adminUser: User = {
  id: "92a50d66-e549-4515-9f19-5c6b8658e132",
  avatar:
    "https://avatars.dicebear.com/api/identicon/ZWxpb3R0YXJsb3ZleXJpZXJAbGl2ZS5mcg==.svg",
  email: "administrator@gmail.com",
  firstName: "Administrator",
  lastName: "Account",
  username: "administrator",
  roles: [Roles.ADMINISTRATOR],
};

const contributorUser: User = {
  id: "c5b6d23b-f2b4-43cb-a54e-66f048282b53",
  avatar:
    "https://avatars.dicebear.com/api/identicon/ZWxpb3R0YXJsb3ZleXJpXYJAbGl2ZS5mcg==.svg",
  email: "contributor@gmail.com",
  firstName: "Contributor",
  lastName: "Account",
  username: "contributor",
  roles: [Roles.CONTRIBUTOR],
};

const memberUser: User = {
  id: "11652f95-3944-40b9-ba05-b6c1e0469651",
  avatar:
    "https://avatars.dicebear.com/api/identicon/ZWxpb3R0YXJsz3ZleXJpXYJAbGl2ZS5mcg==.svg",
  email: "membergmail.com",
  firstName: "Member",
  lastName: "Account",
  username: "member",
  roles: [Roles.MEMBER],
};

export const BaseUsers = [adminUser, contributorUser, memberUser];
