import axios, { AxiosRequestConfig } from "axios";

export enum ApiVersion {
  V1 = "v1.0.0",
  V2 = "v2.0.0",
}

export enum QueryEndpoint {
  Video = "videos",
}

export const httpService = <T>() => {
  const authHeader = () => {
    return ""; // TODO
  };

  const buildHeader = (header: Record<string, string> | undefined) => {
    if (!header) return;
    return {
      ...header,
      Authorization: authHeader(),
    };
  };

  const buildUrl = (endpoint: string, apiVersion: ApiVersion) => {
    return `http://localhost:4000/api/${apiVersion}/${endpoint}`;
  };

  return {
    get: (
      endpoint: string,
      apiVersion: ApiVersion,
      config?: AxiosRequestConfig<T>
    ) =>
      axios
        .get<T>(buildUrl(endpoint, apiVersion), {
          ...config,
          headers: buildHeader(config?.headers),
        })
        .then((response) => response.data),
  };
};
