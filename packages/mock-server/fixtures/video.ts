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

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  publisher?: User;
  likes: number;
  views: number;
  sourceType: string;
  source: string;
  visibility?: string;
  draft?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isLiked?: boolean;
  watchtime?: Watchtime | undefined;
}

export class VideoMock implements Mock {
  name(): string {
    return "video";
  }

  routes(server: Server<AnyRegistry>): void {
    server.timing = 1000;

    server.get("videos", (schema, request) => {
      const { pageSize } = request.queryParams;
      const { models } = (schema as any).videos.all();
      return {
        items: models.slice(0, pageSize ?? 100),
        totalCount: models.length,
      };
    });
    server.get("videos/:id", () => {
      return readableVideo;
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
      title() {
        return faker.name.jobTitle();
      },
      description() {
        return faker.lorem.lines(5);
      },
      thumbnail() {
        return `https://cataas.com/cat/says/${faker.random.word()}?size=50&color=red`;
      },
      publisher() {
        return BaseUsers[0];
      },
      likes() {
        return faker.random.numeric(6);
      },
      views() {
        return faker.random.numeric(6);
      },
      sourceType() {
        return "youtube";
      },
      source() {
        return "Ata9cSC2WpM";
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
      isLiked() {
        return false;
      },
      watchtime() {
        return {
          videoId: faker.datatype.uuid(),
          userId: BaseUsers[0].id,
          watchedSeconds: faker.random.numeric(3),
          watchedPercent: Math.random(),
          isWatched: Math.random() > 0.2,
        };
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

export const readableVideo: Video = {
  id: "50d4ec43-4e66-48ff-9149-d6678243815c",
  slug: "angular-in-100-seconds",
  title: "Angular in 100 seconds",
  description:
    "Angular is arguably the most advanced frontend JavaScript framework ever created. Learn the basics of Angular in 100 Seconds.",
  thumbnail: "https://i.ytimg.com/vi/Ata9cSC2WpM/maxresdefault.jpg",
  publisher: BaseUsers[0],
  visibility: "public",
  draft: false,
  likes: 1,
  views: 1,
  sourceType: "youtube",
  source: "Ata9cSC2WpM",
  createdAt: "2021-07-06T16:21:03.327Z",
  updatedAt: "2022-06-15T07:30:33.819Z",
  isLiked: false,
};
