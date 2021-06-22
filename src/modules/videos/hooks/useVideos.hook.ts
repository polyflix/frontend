import { useInjection } from "@polyflix/di";
import { useEffect, useState } from "react";
import { useAuth } from "../../authentication/hooks/useAuth.hook";
import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Video } from "../models/video.model";
import { VideoService } from "../services/video.service";
import { VideoState, VideosWithPagination } from "../types/videos.type";

type UseVideoHookOptions = {
  /**
   * The fetch mode for the hook.
   * If set to "document", the hook will adapt the query to fetch only one document.
   * Otherwise, the hook will adapt the query to fetch paginated collection of documents.
   * @type string
   */
  mode: "document" | "collection";
  /**
   * The unique identifier for the video.
   * Only usable if the mode is set to "document".
   * @type string
   */
  slug?: string;
  /**
   * The page we want to fetch.
   * Only usable if the mode is set to "collection".
   * @type number
   */
  page?: number;
  /**
   * The limit of items per page.
   * Only usable if the mode is set to "collection".
   * @type number
   */
  limit?: number;
  /**
   * If authorId, fetches the videos related to the author
   */
  authorId?: string;
  /**
   * Callback called when the collection is loaded.
   * @type function
   */
  onCollectionLoaded?: (pages: number) => void;

  isPublic?: boolean;

  isPublished?: boolean;
};

/**
 * Custom hook for use videos fetching in components.
 * @param {UseVideoHookOptions} options the configuration of the hook behavior.
 * @returns {VideoState<T>} the video state
 */
export const useVideos = <T = Video | VideosWithPagination>(
  options: UseVideoHookOptions = { mode: "collection" }
): VideoState<T> => {
  const videoService = useInjection<VideoService>(VideoService);
  const { isLoading: authLoading } = useAuth();
  // Configuration destructuration
  const {
    authorId,
    page,
    limit,
    mode,
    slug,
    onCollectionLoaded,
    isPublic,
    isPublished,
  } = options || {};

  // States definitions
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  // Is the hook in collection mode
  const isCollection = mode === "collection";

  const triggerReload = () => setReload(!reload);

  useEffect(() => {
    // If the auth is currently loading, skip the call
    // because we potentially want a token to execute the
    // query.
    if (authLoading || (!isCollection && !slug)) return;
    setLoading(true);
    (isCollection
      ? videoService.getVideos({
          authorId,
          page,
          pageSize: limit,
          isPublic,
          isPublished,
        })
      : videoService.getVideoBySlug(slug as string)
    )
      .then((data: any) => {
        if (isCollection && onCollectionLoaded) {
          onCollectionLoaded(+(data as VideosWithPagination).totalCount);
        }
        setData(data);
      })
      .catch((err: any) => {
        setAlert({ type: "error", message: err });
        setData(null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [page, limit, reload]);

  return { data, alert, isLoading: loading, triggerReload };
};
