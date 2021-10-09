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
import { usePath } from "../hooks/usePath.hook";
import { Path } from "../models";
import { Timeline } from "../components/Timeline/Timeline.component";

export const PathDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const isMdScreen = useMediaQuery({ query: "(max-width: 767px)" });

  const { data: path, isLoading, alert } = usePath(slug);

  const buildContent = (_path: Path) => {
    return (
      <Container mxAuto fluid className="p-4 pb-8">
        <div
          className={cn(
            "flex flex-col gap-4 mb-8",
            isMdScreen ? styles.container_mobile : styles.container_desktop
          )}
        >
          <Typography as="h1" className="text-4xl sml-2">
            {_path.title}
          </Typography>
          <Typography as="h2" className="text-md italic">
            {t("shared.informations.publishedBy", {
              user: _path.publisher?.displayName,
            })}
          </Typography>
          <Paragraph className="text-sm py-4 md:pr-1">
            {_path.description}
          </Paragraph>
        </div>
        {path && path.getOrderedCourses().length !== 0 ? (
          <Timeline courses={path.getOrderedCourses()}></Timeline>
        ) : null}
      </Container>
    );
  };

  if (alert) return <Redirect to="/not-found" />;
  return (
    <Page variants={fadeOpacity} isLoading={isLoading} title={path?.title}>
      {path && buildContent(path)}
    </Page>
  );
};
