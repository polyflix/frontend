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
import { Module, readableModule } from "./module";

export interface Course extends BaseModel {
  visibility?: string;
  draft?: boolean;
  name: string;
  slug: string;
  description: string;
  content: string;
  user?: User;
  userId?: string;
  __v?: number;
  modules?: Module[]; // TODO
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

    server.get("courses/:id", (schema, request) => {
      return readableCourse;
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

const readableCourse: Course = {
  id: "a3497139-5174-4a62-83be-06d22bfa8486",
  createdAt: "2022-06-09T13:11:05.062Z",
  updatedAt: "2022-06-09T13:11:05.062Z",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus mauris vitae risus vestibulum fermentum. Aliquam erat volutpat. Etiam aliquam congue nulla, ac efficitur elit iaculis id. Proin aliquet magna non nulla lacinia sagittis. Donec sed mi bibendum, convallis elit sed, accumsan erat. Vivamus a dolor sit amet eros ultricies ullamcorper. Sed nec sem ac nunc egestas malesuada nec id diam. Nunc aliquam, sem et interdum rhoncus, lacus est imperdiet velit, vitae mollis nunc elit sed nibh. Cras mollis semper justo, vel fermentum diam. Praesent eget nisl et lorem suscipit tristique. Vestibulum bibendum odio a sapien scelerisque tincidunt. Fusce consequat interdum mauris, eu placerat massa laoreet nec. Vivamus id orci porttitor, ultrices arcu quis, vestibulum erat. Cras condimentum nibh et ante facilisis, a laoreet nulla porta. Donec blandit nibh sagittis ligula tempor, id pharetra justo placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras sed nisl vitae elit suscipit maximus. Cras semper, risus nec vestibulum finibus, lorem felis fermentum quam, ac tincidunt nisi dolor id nisl. Praesent nunc sem, ultricies nec bibendum sit amet, viverra vel lectus.",
  draft: false,
  visibility: "public",
  modules: [readableModule, readableModule, readableModule],
  name: "PolyCloud",
  slug: "polycloud-dlv9vg",
  user: BaseUsers[1],
  userId: BaseUsers[1].id,
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus mauris vitae risus vestibulum fermentum. Aliquam erat volutpat. Etiam aliquam congue nulla, ac efficitur elit iaculis id. Proin aliquet magna non nulla lacinia sagittis. Donec sed mi bibendum, convallis elit sed, accumsan erat. Vivamus a dolor sit amet eros ultricies ullamcorper. Sed nec sem ac nunc egestas malesuada nec id diam. Nunc aliquam, sem et interdum rhoncus, lacus est imperdiet velit, vitae mollis nunc elit sed nibh. Cras mollis semper justo, vel fermentum diam. \nPraesent eget nisl et lorem suscipit tristique. Vestibulum bibendum odio a sapien scelerisque tincidunt. Fusce consequat interdum mauris, eu placerat massa laoreet nec. Vivamus id orci porttitor, ultrices arcu quis, vestibulum erat. Cras condimentum nibh et ante facilisis, a laoreet nulla porta. Donec blandit nibh sagittis ligula tempor, id pharetra justo placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras sed nisl vitae elit suscipit maximus. Cras semper, risus nec vestibulum finibus, lorem felis fermentum quam, ac tincidunt nisi dolor id nisl. Praesent nunc sem, ultricies nec bibendum sit amet, viverra vel lectus. \nSed fermentum tempus sollicitudin. Nulla at augue efficitur, dapibus quam nec, consectetur nunc. Sed aliquet dictum efficitur. Morbi ut auctor sem. Phasellus rutrum, massa nec viverra luctus, eros purus pharetra sem, nec vulputate mi tellus sed sem. Vestibulum vitae mollis nunc. Nam gravida fermentum nisl, at porttitor eros sollicitudin id. Proin quis finibus dui. Maecenas ultricies diam tempus nibh egestas, sit amet euismod dui commodo. Fusce vitae nibh ultricies, vulputate urna et, vestibulum arcu. Cras dictum blandit eleifend. Etiam magna metus, scelerisque et tempus non, feugiat ut est. Donec molestie magna at diam dictum interdum. Morbi accumsan semper lacus at consequat.\n Donec nulla magna, rhoncus nec auctor a, feugiat a mi. Sed a mauris nec justo sodales suscipit. Nam semper non sapien eget iaculis. Aenean suscipit posuere tincidunt. Sed tristique mauris urna, ut vulputate metus iaculis et. Maecenas fermentum leo at est euismod vulputate. Nulla sapien felis, finibus eu purus nec, cursus vulputate ipsum. Nullam vulputate leo enim, a semper dolor ullamcorper tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque ut massa commodo, euismod nulla malesuada, posuere felis.\n Donec tempor tincidunt ex et facilisis. Donec massa magna, eleifend sed cursus ac, efficitur vitae arcu. Nulla et nunc euismod, ultricies velit vel, varius urna. Maecenas sit amet nisi sagittis, cursus risus non, tincidunt nulla. Sed fringilla, tortor vitae ornare pharetra, ante nulla vestibulum massa, nec fermentum libero nunc eget dolor. Proin tincidunt dui nisi, congue fringilla lectus lacinia et. Donec sodales mattis ante, quis lobortis nisi fringilla ac. Curabitur sed convallis sapien, pulvinar convallis libero.",
  __v: 1,
};
