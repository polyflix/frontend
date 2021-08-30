import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../authentication";
import { QuizzListItem } from "../../../quizzes/components/QuizzListItem/QuizzListItem.component";
import { QuizzFilters } from "../../../quizzes/filters/quizz.filter";
import { useQuizzes } from "../../../quizzes/hooks/useQuizzes.hook";
import { Quizz } from "../../../quizzes/models/quizz.model";
import { fadeOpacity } from "../../../ui";
import { Container } from "../../../ui/components/Container/Container.component";
import { ItemsPerPage } from "../../../ui/components/Filters/ItemsPerPage.component";
import { Pagination } from "../../../ui/components/Filters/Pagination.component";
import { Jumbotron } from "../../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../../ui/components/Page/Page.component";

export const QuizzesHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation("resources");

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({});

  const { data, isLoading, refresh } = useQuizzes({
    join: [
      "attempts",
      "questions",
      { field: "attempts.user", select: ["firstName", "lastName"] },
      { field: "user", select: ["firstName", "lastName"] },
    ],
    page: filters.page || 1,
    limit: filters.limit || 10,
    draft: false,
    visibility: "public",
    "attempts.user": user?.id,
  });

  const updateFilters = (updatedFilters: Partial<QuizzFilters>): void => {
    setFilters(updatedFilters);
    refresh(false);
  };

  return (
    <Page
      isLoading={isLoading}
      variants={fadeOpacity}
      title={t("quizzes.seo.history.title")}
    >
      <Container mxAuto className="p-5">
        <Jumbotron
          withGoBack
          title={t("quizzes.seo.history.title")}
          content={t("quizzes.history.description", { ns: "resources" })}
        />
        <div className="flex items-center justify-end my-6">
          <ItemsPerPage
            onChange={(limit: number) =>
              updateFilters({ ...filters, limit, page: 1 })
            }
          />
        </div>
        <div className="text-nx-white">
          {data?.data.map((quizz: Quizz, idx) => (
            <span key={idx}>
              <QuizzListItem
                displayPublisher
                displayAttempts
                displayLastUpdate={false}
                quizz={quizz}
              />
              {idx !== data.data.length - 1 && (
                <div className="w-96 my-16 mx-auto h-1 bg-lightgray" />
              )}
            </span>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Pagination
            onPageChanged={(page: number) => setFilters({ ...filters, page })}
            limit={filters.limit || 10}
            totalRecords={data?.total || 0}
          />
        </div>
      </Container>
    </Page>
  );
};
