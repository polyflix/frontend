import { InformationCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Typography from "../../Typography/Typography.component";
import Button from "../Button.component";

type Props = {
  infoLink: string;
};

const InfoButton: React.FC<Props> = ({ infoLink }) => {
  const { t } = useTranslation();

  return (
    <Link to={infoLink}>
      <Button
        as="button"
        className="flex items-center bg-nx-dark text-nx-white"
      >
        <InformationCircleIcon className="w-6" />{" "}
        <Typography className="ml-1 text-sm md:text-base" as="span">
          {t("shared.common.actions.info")}
        </Typography>
      </Button>
    </Link>
  );
};

export default InfoButton;
