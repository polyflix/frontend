import { ApiVersion, httpService, QueryEndpoint } from "./http.service";

export const videoService = () => {
  return {
    findAll: () => httpService<any>().get(QueryEndpoint.Video, ApiVersion.V2),
  };
};
