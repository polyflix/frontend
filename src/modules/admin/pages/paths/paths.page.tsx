import { PlusIcon } from "@heroicons/react/solid";
import { useInjection } from "@polyflix/di";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import { Paginator } from "../../../common/components/Paginator/Paginator.component";
import { usePagination } from "../../../common/hooks/usePagination.hook";
import { PathListItem } from "../../../paths/components/PathsListItem.component";
import { usePaths } from "../../../paths/hooks/usePaths.hook";
import { Path } from "../../../paths/models/path.model";
import { PathService } from "../../../paths/services";
import { fadeOpacity } from "../../../ui/animations/fadeOpacity";
import { Container } from "../../../ui/components/Container/Container.component";
import { Jumbotron } from "../../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../../ui/components/Page/Page.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";

export const AdminPathPage: React.FC = () => {
  const { t } = useTranslation();
  const { setFinalPage, page, to, limit } = usePagination();

  const pathService = useInjection<PathService>(PathService);

  const {
    data,
    isLoading: isLoadingVideo,
    alert,
    refresh,
  } = usePaths(
    {
      page,
      pageSize: limit,
      order: "-createdAt",
    },
    setFinalPage
  );

  if (alert && alert.type === "not-found") return <Redirect to="/not-found" />;

  const onPathDelete = async (id: string) => {
    await pathService.deletePath(id);
    refresh();
  };

  return (
    <Page
      isLoading={isLoadingVideo}
      variants={fadeOpacity}
      title={t("admin.onBoarding.paths.title")}
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
            <Link to="/paths/create">
              <span className="inline-flex mx-2">
                <PlusIcon className="w-6" /> {t("shared.common.actions.add")}
                {t("pathManagement.path")}
              </span>
            </Link>
          </Typography>
        </div>
        <div className="mx-5">
          {data && (
            <>
              {data.items.map((path: Path) => (
                <PathListItem
                  onDelete={() => onPathDelete(path.id)}
                  key={path.id}
                  path={path}
                  ownerItems={true}
                ></PathListItem>
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
                  <Typography as="h3">{t("paths.error.noPaths")}</Typography>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Page>
  );
};
