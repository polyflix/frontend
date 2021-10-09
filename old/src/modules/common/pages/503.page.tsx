import React from "react";
import { useTranslation } from "react-i18next";
import { FilledButton } from "../../ui/components/Buttons/FilledButton/FilledButton.component";
import { Page } from "../../ui/components/Page/Page.component";
import { Paragraph } from "../../ui/components/Typography/Paragraph/Paragraph.component";
import { Typography } from "../../ui/components/Typography/Typography.component";

export const ServerUnavailablePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("serverUnavailable.seo.title")}
      className="flex items-center justify-center flex-col"
    >
      <div className="flex flex-col items-center justify-center">
        <Typography
          as="h1"
          className="text-nx-red text-6xl"
          bold
          overrideDefaultClasses
        >
          503
        </Typography>

        <Typography as="h1" className="text-3xl">
          {t("serverUnavailable.content.title")} !
        </Typography>

        <Paragraph className="my-4">
          {t("serverUnavailable.content.description")}
        </Paragraph>

        <FilledButton
          as="button"
          onClick={() =>
            window.open(t("serverUnavailable.content.link"), "_blank")
          }
        >
          {t("serverUnavailable.content.redirect")}
        </FilledButton>
      </div>
    </Page>
  );
};
