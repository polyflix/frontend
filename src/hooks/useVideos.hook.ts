import { useEffect, useState } from "react";
import { AlertType } from "../components/Alert/Alert.component";
import { Token } from "../models/token.model";
import Video from "../models/video.model";
import { VideoService } from "../services/video.service";
import { VideoState, VideosWithPagination } from "../types/videos.type";
import { useAuth } from "./useAuth.hook";

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
   * If set to true, the query will fetch only videos of the logged in user.
   * Only usable if the mode is set to "collection".
   * @type boolean
   */
  userOnly?: boolean;
  /**
   * Callback called when the collection is loaded.
   * @type function
   */
  onCollectionLoaded?: (pages: number) => void;
};

/**
 * Custom hook for use videos fetching in components.
 * @param {UseVideoHookOptions} options the configuration of the hook behavior.
 * @returns {VideoState<T>} the video state
 */
export const useVideos = <T = Video | VideosWithPagination>(
  options: UseVideoHookOptions = { mode: "collection" }
): VideoState<T> => {
  const { getVideos, getVideoBySlug } = VideoService;
  const { token, isLoading: authLoading } = useAuth();
  // Configuration destructuration
  const { userOnly, page, limit, mode, slug, onCollectionLoaded } =
    options || {};

  // States definitions
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  // Is the hook in collection mode
  const isCollection = mode === "collection";

  const triggerReload = () => setReload(!reload);

  useEffect(() => {
    // If the auth is currently loading, skip the call
    // because we potentially want a token for execute the
    // query.
    if (authLoading || (!isCollection && !slug)) return;
    setLoading(true);
    (isCollection
      ? getVideos(token as Token, userOnly, page, limit)
      : getVideoBySlug(token as Token, slug as string)
    )
      .then((data: any) => {
        if (isCollection && onCollectionLoaded) {
          onCollectionLoaded(data.pages);
        }
        setData(data);
      })
      .catch((err) => {
        setAlert({ type: "error", message: err });
        setData(null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [page, limit, reload]);

  return { data, alert, isLoading: loading, triggerReload };
};
