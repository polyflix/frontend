import { isUndefined } from "lodash";
import { useFetch } from "../../common/hooks/useFetch.hook";
import { Pagination } from "../../common/types/crud.type";
import { QuizzAttemptFilters } from "../filters/quizz.filter";
import { Attempt } from "../models/attempt.model";
import { QuizzService } from "../services/quizz.service";

export const useQuizzAttempts = (id: string, filters?: QuizzAttemptFilters) => {
  return useFetch<Pagination<Attempt>, QuizzService>(
    QuizzService,
    "getQuizzesAttempts",
    [id, filters],
    { if: !isUndefined(id) }
  );
};
