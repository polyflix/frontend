import { AnimateSharedLayout, motion } from "framer-motion";
import { capitalize } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../../authentication";
import { cn } from "../../../common";
import { Visibility } from "../../../common/types/crud.type";
import { QuizzListItem } from "../../../quizzes/components/QuizzListItem/QuizzListItem.component";
import { QuizzFilters } from "../../../quizzes/filters/quizz.filter";
import { useQuizzes } from "../../../quizzes/hooks/useQuizzes.hook";
import { Quizz } from "../../../quizzes/models/quizz.model";
import { CrudFilterService } from "../../../quizzes/services/crud-filter.service";
import { fadeOpacity, FilledButton, OutlineButton } from "../../../ui";
import { Container } from "../../../ui/components/Container/Container.component";
import { ItemsPerPage } from "../../../ui/components/Filters/ItemsPerPage.component";
import { Pagination } from "../../../ui/components/Filters/Pagination.component";
import { SortBy } from "../../../ui/components/Filters/SortBy.component";
import { Jumbotron } from "../../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../../ui/components/Page/Page.component";

export const UserQuizzesPage: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("resources");

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({
    page: 1,
    limit: 10,
  });

  const {
    data,
    isLoading: isQuizzesLoading,
    refresh,
  } = useQuizzes({
    join: [
      { field: "user", select: ["firstName", "lastName"] },
      "questions",
      "questions.alternatives",
    ],
    "user.id": id,
    ...filters,
  });

  const updateFilters = (updatedFilters: Partial<QuizzFilters>): void => {
    setFilters(updatedFilters);
    refresh(false);
  };

  const ALL_LABEL = t("shared.common.all", { ns: "common" });

  return (
    <Page
      isLoading={isQuizzesLoading}
      variants={fadeOpacity}
      title={t("quizzes.seo.user.title")}
    >
      <Container mxAuto className="p-5 grid grid-cols-12 gap-6">
        <Jumbotron
          withGoBack
          title={t("quizzes.seo.user.title")}
          content={t("quizzes.jumbotron.description", { ns: "resources" })}
        >
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              <Link to="/quizzes/new">
                <FilledButton as="button">
                  {t("quizzes.jumbotron.create", { ns: "resources" })}
                </FilledButton>
              </Link>
              <div className="mx-2"></div>
              <Link to="/quizzes/new?source=import">
                <OutlineButton as="button">
                  {t("quizzes.jumbotron.import", { ns: "resources" })}
                </OutlineButton>
              </Link>
            </div>
            <Link to={`/profile/quizzes/${id}/history`}>
              <OutlineButton as="button">
                {t("quizzes.jumbotron.history", { ns: "resources" })}
              </OutlineButton>
            </Link>
          </div>
        </Jumbotron>
        <div className="flex items-center col-span-12">
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
        <div className="col-span-12 md:col-span-3">
          <div className="bg-darkgray rounded-md p-8 text-nx-white">
            <h3 className="text-lg font-bold">
              {t("shared.common.filtersLabel", { ns: "common" })}
            </h3>

            <div className="my-3" />

            <h5>Status</h5>
            <ul className="text-sm text-lightgray">
              {[
                ALL_LABEL,
                t("quizzes.filters.status.draft"),
                t("quizzes.filters.status.published"),
              ].map((value, index) => (
                <li
                  key={index}
                  onClick={() =>
                    updateFilters({
                      ...filters,
                      draft:
                        value === ALL_LABEL
                          ? undefined
                          : value === t("quizzes.filters.status.draft"),
                    })
                  }
                  className={cn(
                    "cursor-pointer transition-all hover:text-nx-red",
                    ((filters.draft === undefined && value === ALL_LABEL) ||
                      (filters.draft &&
                        value === t("quizzes.filters.status.draft")) ||
                      (filters.draft !== undefined &&
                        !filters.draft &&
                        value === t("quizzes.filters.status.published"))) &&
                      "text-nx-red",
                    index % 2 === 0 && "my-1"
                  )}
                >
                  {capitalize(value)}
                </li>
              ))}
            </ul>

            <div className="my-3" />

            <h5>{t("quizzes.filters.visibility.label")}</h5>
            <ul className="text-sm text-lightgray">
              {[ALL_LABEL, "public", "private", "protected"].map(
                (value, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      updateFilters({
                        ...filters,
                        visibility:
                          value === ALL_LABEL
                            ? undefined
                            : (value as Visibility),
                      })
                    }
                    className={cn(
                      "cursor-pointer transition-all hover:text-nx-red",
                      ((!filters.visibility && value === ALL_LABEL) ||
                        filters.visibility === value) &&
                        "text-nx-red",
                      index % 2 === 0 && "my-1"
                    )}
                  >
                    {capitalize(
                      value === ALL_LABEL
                        ? ALL_LABEL
                        : t(`quizzes.filters.visibility.${value}`)
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
        <AnimateSharedLayout>
          <motion.div
            layout
            className="text-nx-white group col-span-12 md:col-span-9"
          >
            {data?.data.map((quizz: Quizz) => (
              <motion.div layout key={quizz.id}>
                <QuizzListItem
                  onDelete={() => refresh(false)}
                  displayRemainingAttempts={false}
                  displayScore={false}
                  displayNumberOfQuestions
                  displayCrudButtons={quizz.isCreator(user!)}
                  quizz={quizz}
                />
                <div className="mt-6" />
              </motion.div>
            ))}
          </motion.div>
        </AnimateSharedLayout>

        <div className="col-span-12 items-center flex justify-center">
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
