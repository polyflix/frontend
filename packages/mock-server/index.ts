import { createServer } from "miragejs";
import { FactoryDefinition, ModelDefinition } from "miragejs/-types";
import { CourseMock } from "./fixtures/course";
import { Mock } from "./fixtures/generic";
import { PageMock } from "./fixtures/page";
import { SearchMock } from "./fixtures/search";
import { UserMock } from "./fixtures/user";
import { VideoMock } from "./fixtures/video";

// Add future mock implementation here
// The server will autoconfigure itself thanks to the following array
const mocks: Mock[] = [
  new UserMock(),
  new VideoMock(),
  new SearchMock(),
  new CourseMock(),
  new PageMock(),
];

function initModels(): { [key: string]: ModelDefinition } {
  const models: { [key: string]: ModelDefinition } = {};
  for (const mock of mocks) {
    models[mock.name()] = mock.model();
  }
  return models;
}

function initFactories(): { [key: string]: FactoryDefinition } {
  const factories: { [key: string]: FactoryDefinition } = {};
  for (const mock of mocks) {
    factories[mock.name()] = mock.factory();
  }
  return factories;
}

export function initMockServer() {
  return createServer({
    namespace: "api/v2.0.0",
    models: initModels(),
    factories: initFactories(),
    seeds(server) {
      mocks.forEach((mock) => mock.seeds(server));
    },
    routes() {
      this.urlPrefix = "http://localhost:4000";
      mocks.forEach((mock) => mock.routes(this));
    },
  });
}

export { BaseUsers } from "./fixtures/user";
