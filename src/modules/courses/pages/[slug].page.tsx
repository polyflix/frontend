import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useParams } from "react-router";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";

import { Paragraph, Typography } from "../../ui";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import styles from "./slug.module.scss";
import { cn } from "../../common/utils/classes.util";
import { useMediaQuery } from "react-responsive";
import { useCourse } from "../hooks";
import { Course } from "../models";

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const isMdScreen = useMediaQuery({ query: "(max-width: 767px)" });

  const { data: course, isLoading, alert } = useCourse(slug);

  const buildContent = (_course: Course) => {
    return (
      <Container mxAuto fluid className="p-4 pb-8">
        <div
          className={cn(
            "flex flex-col gap-4 mb-8",
            isMdScreen ? styles.container_mobile : styles.container_desktop
          )}
        >
          <Typography as="h1" className="text-4xl sml-2">
            {_course.title}
            <Typography as="span" className="text-sm italic">
              {t("shared.informations.publishedBy")}
              {_course.publisher?.displayName}
            </Typography>
          </Typography>
          <Paragraph className="text-sm py-4 md:pr-1">
            {_course.content}
          </Paragraph>
        </div>
      </Container>
    );
  };

  if (alert) return <Redirect to="/not-found" />;
  return (
    <Page variants={fadeOpacity} isLoading={isLoading} title={course?.title}>
      {course && buildContent(course)}
    </Page>
  );
};
