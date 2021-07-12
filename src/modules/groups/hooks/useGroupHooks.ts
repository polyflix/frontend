import { Token, useAuth } from "../../authentication";
import { useEffect, useState } from "react";
import { AlertType } from "../../ui";
import { Group } from "../models/group.model";
import { useInjection } from "@polyflix/di";
import { GroupState, GroupsWithPagination } from "../types/groups.type";
import { GroupService } from "../services/group.service";
import { PaginationFilter } from "../../common/types/filter.type";

export interface UseGroupHookOptions extends PaginationFilter {
  id?: string;
  user?: string;
  mode?: string;
  order?: string;

  /**
   * The unique identifier for the group.
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
   * If authorId, fetches the groups related to the owner
   */
  ownerId?: string;
  /**
   * Callback called when the collection is loaded.
   * @type function
   */
  onCollectionLoaded?: (pages: number) => void;

  /**
   * Desired groups
   * @type string
   */
  type?: string;
}

/**
 * Custom hook for use groups fetching in components.
 * @param {UseGroupHookOptions} options the configuration of the hook behavior.
 * @returns {GroupState<T = Group | GroupsWithPagination>} the group state
 */
export const useGroups = <T = Group | GroupsWithPagination>(
  options: UseGroupHookOptions = {}
): GroupState<T> => {
  const groupService = useInjection<GroupService>(GroupService);
  const { token, isLoading: authLoading } = useAuth();
  // Configuration destructuration
  const { page, limit, mode, slug, onCollectionLoaded, ownerId, type } =
    options || {};

  // States definitions
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
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
    // because we potentially want a token for execute the
    // query.
    if (authLoading) return; //If user isnt connected
    setLoading(true);
    (isCollection
      ? type === "joined"
        ? groupService.getGroupsJoined({})
        : groupService.getGroups({
            ownerId,
            page,
          })
      : groupService.getGroupBySlug(token as Token, slug as string)
    )
      .then((data: any) => {
        if (isCollection && onCollectionLoaded) {
          onCollectionLoaded(data.pages);
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

// export const useGroups = (
//   filters: UseGroupHookOptions,
//   onCollectionLoaded?: (totalItems: number) => any
// ) => {
//   return useFetch<GroupsWithPagination, GroupService>(
//     GroupService,
//     "getGroups",
//     [filters],
//     {
//       onComplete: onCollectionLoaded
//         ? ({ totalCount }) => onCollectionLoaded(totalCount)
//         : undefined,
//       deps: [filters.page, filters.order, filters.pageSize],
//     }
//   );
// };
