import { useFetch } from "../../common/hooks/useFetch.hook";
import { IVideoFilter } from "../filters/video.filter";
import { VideoService } from "../services";
import { VideosWithPagination } from "../types";

export const useVideos = (
  filters: IVideoFilter,
  onCollectionLoaded?: (totalItems: number) => any
) => {
  return useFetch<VideosWithPagination, VideoService>(
    VideoService,
    "getVideos",
    [filters],
    {
      onComplete: onCollectionLoaded
        ? ({ totalCount }) => onCollectionLoaded(totalCount)
        : undefined,
      deps: [filters.page, filters.order, filters.pageSize],
    }
  );
};
