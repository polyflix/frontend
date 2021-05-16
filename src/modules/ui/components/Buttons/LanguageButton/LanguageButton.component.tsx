import React from "react";
import { useTranslation } from "react-i18next";
import { EnglishFlagIcon } from "../../Icons/EnglishFlag.icon";
import { FrenchFlagIcon } from "../../Icons/FrenchFlag.icon";
import { Button } from "../Button.component";

export const LanguageButton: React.FC = () => {
  const { i18n } = useTranslation();

  let currentLanguage = localStorage.getItem("i18nextLng");

  if (currentLanguage && currentLanguage.length > 2) {
    currentLanguage = currentLanguage.substring(0, 2);
    localStorage.setItem("i18nextLng", currentLanguage);
  }

  const otherLanguage = currentLanguage === "en" ? "fr" : "en";

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language);
  };

  return (
    <Button as="button" onClick={() => changeLanguage(otherLanguage)}>
      {currentLanguage === "fr" ? <FrenchFlagIcon /> : <EnglishFlagIcon />}
    </Button>
  );
};

export default LanguageButton;
