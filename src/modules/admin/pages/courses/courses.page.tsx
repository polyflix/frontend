import { PlusIcon } from "@heroicons/react/solid";
import { useInjection } from "@polyflix/di";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import { Paginator } from "../../../common/components/Paginator/Paginator.component";
import { usePagination } from "../../../common/hooks/usePagination.hook";
import { CourseService } from "../../../courses";
import { CourseListItem } from "../../../courses/components/CoursesListItem.component";
import { useCourses } from "../../../courses/hooks/useCourses.hook";
import { Course } from "../../../courses/models/course.model";
import { fadeOpacity } from "../../../ui/animations/fadeOpacity";
import { Container } from "../../../ui/components/Container/Container.component";
import { Jumbotron } from "../../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../../ui/components/Page/Page.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";

export const AdminCoursePage: React.FC = () => {
  const { t } = useTranslation();
  const { setFinalPage, page, to, limit } = usePagination();

  const courseService = useInjection<CourseService>(CourseService);

  const {
    data,
    isLoading: isLoadingVideo,
    alert,
    refresh,
  } = useCourses(
    {
      page,
      pageSize: limit,
      order: "-createdAt",
    },
    setFinalPage
  );

  if (alert && alert.type === "not-found") return <Redirect to="/not-found" />;

  const onCourseDelete = async (id: string) => {
    await courseService.deleteCourse(id);
    refresh();
  };

  return (
    <Page
      isLoading={isLoadingVideo}
      variants={fadeOpacity}
      title={t("admin.onBoarding.courses.title")}
    >
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t("admin.onBoarding.courses.title")}
          content={t("admin.onBoarding.question")}
        />
        <div className="mt-5">
          <Typography
            as="span"
            className="flex items-center text-nx-red"
            overrideDefaultClasses
          >
            <Link to="/collections/create">
              <span className="inline-flex mx-2">
                <PlusIcon className="w-6" /> {t("shared.common.actions.add")}{" "}
                {t("courseManagement.course")}
              </span>
            </Link>
          </Typography>
        </div>
        <div className="mx-5">
          {data && (
            <>
              {data.items.map((course: Course) => (
                <CourseListItem
                  course={course}
                  onDelete={() => onCourseDelete(course.id)}
                  ownerItems={true}
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
                  <Typography as="h3">
                    {t("courses.error.noCourses")}
                  </Typography>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Page>
  );
};
