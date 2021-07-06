import { useTranslation } from "react-i18next";
import { Redirect } from "react-router";
import { usePagination } from "../../common/hooks";
import { useCollections } from "../hooks";
import { fadeOpacity, Typography } from "../../ui";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { Title } from "../../ui/components/Typography/Title/Title.component";
import { Collection } from "../models";
import { Paginator } from "../../common/components/Paginator/Paginator.component";
import { CollectionListItem } from "../components";
import { CollectionsWithPagination } from "../types";

export const CollectionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { page, to, limit } = usePagination();

  const {
    data,
    isLoading: isLoadingVideo,
    alert,
  } = useCollections<CollectionsWithPagination>({
    page,
    pageSize: limit,
    mode: "collection",
  });

  if (alert && alert.type === "not-found") return <Redirect to="/not-found" />;

  return (
    <Page
      isLoading={isLoadingVideo}
      variants={fadeOpacity}
      title={t("collections.seo.title")}
    >
      <Container mxAuto className="px-5 flex flex-col">
        {alert && alert.type === "error" && (
          <div className="bg-nx-red-dark w-1/4 text-white font-extrabold rounded flex text-center justify-center self-center">
            {`${alert.message}`}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Title className="my-5">{t("collections.seo.mainTitle")}</Title>
        </div>
        {data && (
          <>
            {data.items.map((collection: Collection) => (
              <CollectionListItem
                collection={collection}
                ownerItems={false}
              ></CollectionListItem>
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
