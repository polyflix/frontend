import { AnimateSharedLayout, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fadeOpacity } from "../../ui";
import { Container } from "../../ui/components/Container/Container.component";
import { ItemsPerPage } from "../../ui/components/Filters/ItemsPerPage.component";
import { Pagination } from "../../ui/components/Filters/Pagination.component";
import { SortBy } from "../../ui/components/Filters/SortBy.component";
import { Jumbotron } from "../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../ui/components/Page/Page.component";
import { SearchBar } from "../../ui/components/SearchBar/SearchBar.component";
import { QuizzListItem } from "../components/QuizzListItem/QuizzListItem.component";
import { QuizzFilters } from "../filters/quizz.filter";
import { useQuizzes } from "../hooks/useQuizzes.hook";
import { Quizz } from "../models/quizz.model";
import { CrudFilterService } from "../services/crud-filter.service";

const getQuizzSearch = (value: string) => [
  {
    name: {
      $cont: value,
    },
  },
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

export const QuizzesPage: React.FC = () => {
  const { t } = useTranslation("resources");

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({
    page: 1,
    limit: 10,
    sort: [{ field: "createdAt", order: "DESC" }],
  });

  const { data, isLoading, refresh } = useQuizzes({
    join: [
      { field: "user", select: ["firstName", "lastName"] },
      { field: "questions", select: ["label"] },
    ],
    draft: false,
    visibility: "public",
    ...filters,
  });

  const updateFilters = (updatedFilters: Partial<QuizzFilters>): void => {
    setFilters(updatedFilters);
    refresh(false);
  };

  return (
    <Page
      isLoading={isLoading}
      variants={fadeOpacity}
      title={t("quizzes.seo.global.title")}
    >
      <Container mxAuto className="p-5">
        <Jumbotron
          content={t("quizzes.global.description")}
          title={t("quizzes.seo.global.title")}
          withGoBack
        />
        <div className="flex items-center my-8">
          <div className="w-full">
            <SearchBar
              placeholder={t("quizzes.global.search")}
              onChange={(search) =>
                updateFilters({
                  ...filters,
                  search: { $or: [...getQuizzSearch(search)] },
                })
              }
            />
          </div>
          <div className="mx-2" />
          <SortBy
            label={t("quizzes.filters.name")}
            property="name"
            onSort={CrudFilterService.buildSort("name", filters.sort, (sort) =>
              updateFilters({ ...filters, sort })
            )}
          />
          <div className="mx-2" />
          <SortBy
            label="Date"
            property="createdAt"
            onSort={CrudFilterService.buildSort(
              "createdAt",
              filters.sort,
              (sort) => updateFilters({ ...filters, sort })
            )}
          />
          <div className="mx-2" />
          <ItemsPerPage
            onChange={(limit) => updateFilters({ ...filters, limit })}
          />
        </div>
        <AnimateSharedLayout>
          <motion.div layout className="grid group grid-cols-12 gap-8">
            {data?.data.map((quizz: Quizz) => (
              <motion.div layout key={quizz.id} className="col-span-6">
                <QuizzListItem
                  displayTags
                  displayNumberOfQuestions
                  displayRemainingAttempts={false}
                  displayScore={false}
                  displayPublisher
                  quizz={quizz}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimateSharedLayout>

        <div className="items-center flex justify-center mt-6">
          <Pagination
            limit={filters.limit}
            totalRecords={data?.total}
            onPageChanged={(page) => updateFilters({ ...filters, page })}
          />
        </div>
      </Container>
    </Page>
  );
};
