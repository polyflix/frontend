import { useFetch } from "../../common/hooks/useFetch.hook";
import { Video } from "../models";
import { VideoService } from "../services";

export const useVideo = (slug: string) => {
  return useFetch<Video, VideoService>(VideoService, "getVideoBySlug", [slug]);
};
