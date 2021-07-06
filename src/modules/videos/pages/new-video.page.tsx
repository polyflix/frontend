import React from "react";
import { Typography } from "../../ui/components/Typography/Typography.component";
import { Page } from "../../ui/components/Page/Page.component";
import { CreateVideoCard } from "../../ui/components/Cards/CreateVideoCard/CreateVideoCard.component";
import {
  ArrowCircleLeftIcon,
  DesktopComputerIcon,
} from "@heroicons/react/outline";
import { YoutubeLogo } from "../../ui/components/Icons/YoutubeLogo.icon";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

export const NewVideoPage: React.FC = () => {
  const { t } = useTranslation();

  let history = useHistory();
  const onGoBack = () => history.goBack();

  return (
    <Page className="" title="Nouvelle video">
      <div className="flex mt-10 mb-20 justify-between">
        <Typography
          as="span"
          className="text-nx-red col-span-4"
          overrideDefaultClasses
        >
          <span className="inline-flex mx-2 cursor-pointer" onClick={onGoBack}>
            <ArrowCircleLeftIcon className="w-6 mr-1" />{" "}
            {t("shared.common.actions.back")}{" "}
          </span>
        </Typography>
        <div className="flex flex-col items-center">
          <Typography
            as="h1"
            bold
            overrideDefaultClasses
            className="text-2xl md:text-3xl text-nx-red mb-5"
          >
            {t("shared.common.actions.add")} {t("videoManagement.video")}
          </Typography>
          <Typography
            as="p"
            overrideDefaultClasses
            className="text-xl text-white"
          >
            {t("videoManagement.onBoarding.source")}
          </Typography>
        </div>
        <div></div>
      </div>
      <div className="flex justify-center items-center px-4 flex-col lg:flex-row">
        <CreateVideoCard
          className="mr-0 lg:mr-5"
          route="/videos/create"
          title={t("videoManagement.onBoarding.youtube.title")}
          description={t("videoManagement.onBoarding.youtube.description")}
          image={<YoutubeLogo className="hidden lg:block w-full lg:w-1/4" />}
        />
        <CreateVideoCard
          className="ml-0 lg:ml-5"
          route="/videos/create?type=upload"
          title={t("videoManagement.onBoarding.local.title")}
          description={t("videoManagement.onBoarding.local.description")}
          image={
            <DesktopComputerIcon className="text-white hidden lg:block w-full lg:w-1/4" />
          }
        />
      </div>
    </Page>
  );
};
