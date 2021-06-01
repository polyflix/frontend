import { Dispatch, SetStateAction } from "react";

export type Pagination = {
  page: number;
  limit: ItemsPerPage;
  to: (mode: PaginationMode) => void;
  setFinalPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<ItemsPerPage>>;
};

export type PaginationMode = "last" | "first" | "next" | "previous";

export type ItemsPerPage = 20 | 30 | 50 | 100 | 1;
