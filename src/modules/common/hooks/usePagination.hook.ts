import { useState } from "react";
import {
  ItemsPerPage,
  Pagination,
  PaginationMode,
} from "../types/pagination.type";

export const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT: ItemsPerPage = 1;

/**
 * Custom hook for handling pagination states.
 * @returns {Pagination} the pagination
 */
export const usePagination = (): Pagination => {
  const [finalPage, setFinalPage] = useState<number>(DEFAULT_PAGE);
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [limit, setLimit] = useState<ItemsPerPage>(DEFAULT_LIMIT);
  const goToPage = (mode: PaginationMode): void => {
    let _page: number;
    switch (mode) {
      case "first":
        _page = DEFAULT_PAGE;
        break;
      case "last":
        _page = finalPage;
        break;
      case "next":
        _page = page + 1 <= finalPage ? page + 1 : page;
        break;
      case "previous":
        _page = page - 1 >= DEFAULT_PAGE ? page - 1 : page;
        break;
      default:
        _page = DEFAULT_PAGE;
        break;
    }
    if (page !== _page) setPage(_page);

    window.scrollTo(0, 0);
  };

  return {
    page,
    limit,
    to: goToPage,
    setFinalPage,
    setLimit,
  };
};
