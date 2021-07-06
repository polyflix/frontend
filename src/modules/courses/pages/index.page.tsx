import { useTranslation } from "react-i18next";
import { Redirect } from "react-router";
import { usePagination } from "../../common/hooks";
import { useCourses } from "../hooks";
import { fadeOpacity, Typography } from "../../ui";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { Title } from "../../ui/components/Typography/Title/Title.component";
import { Course } from "../models";
import { Paginator } from "../../common/components/Paginator/Paginator.component";
import { CourseListItem } from "../components";

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const { setFinalPage, page, to, limit } = usePagination();

  const {
    data,
    isLoading: isLoadingVideo,
    alert,
  } = useCourses(
    {
      page,
      pageSize: limit,
      order: "-createdAt",
    },
    setFinalPage
  );

  if (alert && alert.type === "not-found") return <Redirect to="/not-found" />;

  return (
    <Page
      isLoading={isLoadingVideo}
      variants={fadeOpacity}
      title={t("courses.seo.title")}
    >
      <Container mxAuto className="px-5 flex flex-col">
        {alert && alert.type === "error" && (
          <div className="bg-nx-red-dark w-1/4 text-white font-extrabold rounded flex text-center justify-center self-center">
            {`${alert.message}`}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Title className="my-5">{t("courses.seo.mainTitle")}</Title>
        </div>
        {data && (
          <>
            {data.items.map((course: Course) => (
              <CourseListItem
                course={course}
                ownerItems={false}
              ></CourseListItem>
            ))}
            {data.items.length > 0 ? (
              <Paginator
                className="py-5 justify-end"
                page={page}
                onPageChanged={to}
                total={Math.floor(data.totalCount / data.items.length)}
              />
            ) : (
              <div className="text-white">
                {" "}
                <Typography as="h3">{t("courses.error.noCourses")}</Typography>
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  );
};
