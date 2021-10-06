import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useQuery } from "../../common/hooks/useQuery";
import { Page } from "../../ui/components/Page/Page.component";
import { CollectionForm } from "../components/CollectionForm/CollectionForm.component";
import { CollectionPassword } from "../components/CollectionPassword/CollectionPassword.component";
import { useCollections } from "../hooks";
import { Collection } from "../models";

export const CreateUpdateCollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const password = useQuery("password") as string;
  const { t } = useTranslation();

  const { data, isLoading, alert } = useCollections<Collection>({
    mode: "document",
    slug,
    password,
  });

  return (
    <Page
      isLoading={isLoading}
      title={`${
        slug ? t("shared.common.actions.edit") : t("shared.common.actions.add")
      } ${t("collectionManagement.collection")}`}
    >
      {alert && alert.message === "Forbidden" ? (
        <CollectionPassword
          redirection={`/collections/update/${slug}?password=`}
        />
      ) : (
        <CollectionForm collection={data} />
      )}
    </Page>
  );
};
