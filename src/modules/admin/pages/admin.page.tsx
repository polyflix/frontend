import { TagIcon } from "@heroicons/react/outline";
import React from "react";
import { useTranslation } from "react-i18next";
import { CreateVideoCard } from "../../ui/components/Cards/CreateVideoCard/CreateVideoCard.component";
import { Container } from "../../ui/components/Container/Container.component";
import { Jumbotron } from "../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../ui/components/Page/Page.component";

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("admin.seo.title")}>
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t("admin.seo.title")}
          content={t("admin.onBoarding.question")}
        />
        <div>
          <div className="flex justify-center items-center mt-2 p-3 lg:flex-row">
            <CreateVideoCard
              className="mr-0 lg:mr-5"
              route="/admin/tags"
              title={t("admin.onBoarding.tags.title")}
              description={t("admin.onBoarding.tags.description")}
              image={
                <TagIcon className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
          </div>
        </div>
      </Container>
    </Page>
  );
};
