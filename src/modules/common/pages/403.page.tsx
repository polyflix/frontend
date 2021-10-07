import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FilledButton } from "../../ui/components/Buttons/FilledButton/FilledButton.component";
import { Page } from "../../ui/components/Page/Page.component";
import { Paragraph } from "../../ui/components/Typography/Paragraph/Paragraph.component";
import { Typography } from "../../ui/components/Typography/Typography.component";

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("forbidden.seo.title")} className="items-center">
      <div className="flex flex-col items-center justify-center">
        <Typography
          as="h1"
          className="text-nx-red text-6xl"
          bold
          overrideDefaultClasses
        >
          403
        </Typography>

        <Typography as="h1" className="text-3xl">
          {t("forbidden.content.title")} !
        </Typography>

        <Paragraph className="my-4">
          {t("forbidden.content.description")}
        </Paragraph>

        <Link to="/">
          <FilledButton as="button">{t("forbidden.content.home")}</FilledButton>
        </Link>
      </div>
    </Page>
  );
};
