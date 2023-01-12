import { AppRegistry } from "..";
import { Mock } from "./generic";
import { BaseUsers } from "./user";
import { readableVideo } from "./video";
import { faker } from "@faker-js/faker";
import { Factory, Model, Server } from "miragejs";
import { FactoryDefinition, ModelDefinition } from "miragejs/-types";

export interface Attachment {
  id: string;
  title: string;
  url: string;
  description?: string;
  userId: string;
  status: AttachmentStatus;
  type: AttachmentType;
  videos: string[];
  modules: string[];
}

export class AttachmentMock implements Mock {
  name(): string {
    return "attachment";
  }

  /**
   * Converts page and pageSize to start and end, to use with `slice` method
   */
  getPagination = (queryParams: Record<string, string>) => {
    const page = parseInt(queryParams.page);
    const pageSize = parseInt(queryParams.pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return { start, end };
  };

  routes(server: Server<AppRegistry>): void {
    server.get("attachments/", (schema, { queryParams }) => {
      const { start, end } = this.getPagination(queryParams);
      const models = schema.all("attachment");
      return {
        items: models.slice(start, end).models,
        totalCount: models.length,
      };
    });

    server.get("attachments/video/:videoId", (schema) => {
      const { models } = schema.all("attachment");
      return {
        items: models,
        totalCount: models.length,
      };
    });

    server.get("attachments/:id", (schema, { params }) => {
      return schema.find("attachment", params.id);
    });

    server.post("attachments", (schema, request) => {
      return schema.create("attachment", JSON.parse(request.requestBody));
    });
  }

  factory(): FactoryDefinition<{}> {
    return Factory.extend({
      id() {
        return faker.datatype.uuid();
      },
      title() {
        return faker.internet.domainWord();
      },
      description() {
        return faker.datatype.string();
      },
      url() {
        return faker.internet.url();
      },
      userId() {
        return BaseUsers[0].id;
      },
      status() {
        return AttachmentStatus.Completed;
      },
      videos() {
        return [];
      },
      modules() {
        return [];
      },
    });
  }

  seeds(server: Server<AppRegistry>): void {
    server.createList(this.name(), 20);
  }

  model(): ModelDefinition<Attachment> {
    return Model.extend({});
  }
}

export enum AttachmentStatus {
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
}

export enum AttachmentType {
  External = "EXTERNAL",
  Internal = "INTERNAL",
}

export const mockAttachment: Attachment = {
  id: "139c2ab0-4e66-48ff-9149-d66782432bfa",
  title: "Google",
  url: "https://google.com",
  videos: [readableVideo.id],
  modules: [],
  type: AttachmentType.External,
  status: AttachmentStatus.Completed,
  userId: BaseUsers[0].id,
};
