import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { QueryFilter } from "../../common/types/crud.type";
import { Container, fadeOpacity, Page } from "../../ui";
import { ItemsPerPage } from "../../ui/components/Filters/ItemsPerPage.component";
import { Pagination } from "../../ui/components/Filters/Pagination.component";
import { SortBy } from "../../ui/components/Filters/SortBy.component";
import { Jumbotron } from "../../ui/components/Jumbotron/Jumbotron.component";
import { SearchBar } from "../../ui/components/SearchBar/SearchBar.component";
import { QuizzAttemptsList } from "../components/Attempts/QuizzAttemptsList.component";
import { useQuizz } from "../hooks/useQuizz.hook";
import { useQuizzAttempts } from "../hooks/useQuizzAttempts.hook";
import { CrudFilterService } from "../services/crud-filter.service";
import { useAuth } from "../../authentication/hooks";

const getSearchByName = (value: string) => [
  {
    "user.firstName": {
      $cont: value,
    },
  },
  {
    "user.lastName": {
      $cont: value,
    },
  },
];

export const QuizzResultsPage = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("resources");

  const [filters, setFilters] = useState<QueryFilter>({});

  const { data: quizz, isLoading: isQuizzLoading } = useQuizz(id, {
    join: ["questions", { field: "user", select: ["firstName", "lastName"] }],
  });

  // Fetch attempts for the quizz, we have to do another request in order to be able to paginate this.
  const {
    data: attempts,
    isLoading: isAttemptsLoading,
    refresh,
  } = useQuizzAttempts(id, {
    join: [
      {
        field: "user",
        select: ["firstName", "lastName"],
      },
    ],
    ...filters,
  });

  const updateFilters = (updatedFilters: Partial<QueryFilter>): void => {
    setFilters(updatedFilters);
    refresh(false);
  };

  return (
    <Page
      isLoading={isQuizzLoading || isAttemptsLoading}
      variants={fadeOpacity}
      guard={quizz && quizz.isCreator(user!)}
      title={t("quizzes.results.title", { quizzName: quizz?.name })}
    >
      <Container
        mxAuto
        className="text-nx-white w-full md:w-10/12 lg:w-8/12 p-5"
      >
        <Jumbotron
          withGoBack
          content={t("quizzes.results.description")}
          title={t("quizzes.results.title", { quizzName: quizz?.name })}
        />
        <div className="items-center flex my-5 flex-wrap md:flex-nowrap">
          <div className="w-full">
            <SearchBar
              onChange={(value) =>
                updateFilters({
                  ...filters,
                  search: { $or: [...getSearchByName(value)] },
                })
              }
              placeholder={t("quizzes.results.search")}
            />
          </div>
          <div className="md:mx-2" />
          <SortBy
            onSort={CrudFilterService.buildSort(
              "createdAt",
              filters.sort,
              (sort) => updateFilters({ ...filters, sort })
            )}
            label="Date"
            property="createdAt"
          />
          <div className="mx-2" />
          <SortBy
            onSort={CrudFilterService.buildSort("score", filters.sort, (sort) =>
              updateFilters({ ...filters, sort })
            )}
            label="Score"
            property="score"
          />
          <div className="mx-2" />
          <ItemsPerPage
            onChange={(limit) => updateFilters({ ...filters, limit })}
          />
        </div>

        <QuizzAttemptsList attempts={attempts?.data} quizz={quizz} />

        <div className="flex items-center justify-center mt-4">
          <Pagination
            limit={filters.limit || 10}
            totalRecords={attempts?.total || 1}
            onPageChanged={(page) => updateFilters({ ...filters, page })}
          />
        </div>
      </Container>
    </Page>
  );
};
