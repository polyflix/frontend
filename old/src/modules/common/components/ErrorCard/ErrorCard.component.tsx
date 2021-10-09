import React from "react";
import Stitch from "../../../../assets/images/stitch.png";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Typography } from "../../../ui";
import { useTranslation } from "react-i18next";

type Props = {
  content?: string;
};

export const ErrorCard: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation("mediaPlayer");
  return (
    <div className="flex justify-center w-full h-full">
      <div
        style={{ backgroundColor: "#151515" }}
        className="relative w-80 h-60 md:w-96 md:h-64 pt-8 rounded-2xl m-auto"
      >
        <div className="w-64 mx-auto">
          <div className="absolute">
            <img src={Stitch} alt={""} className="w-16 md:w-32 mx-auto" />
            <ExclamationCircleIcon
              style={{ color: "#FF0000" }}
              className="w-9 pt-4 mx-auto"
            />
            <Typography
              as={"p"}
              className="text-center font-jakarta w-64 mx-auto pt-2"
              bold
            >
              {t("mediaError")}
            </Typography>
          </div>
        </div>
        <svg
          className="ml-auto h-full"
          viewBox="0 0 173 131"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M113.583 181.783C86.6965 186.487 54.498 176.977 37.9174 161.024C21.8346 145.55 39.7699 123.309 33.3086 104.547C27.2326 86.9039 -5.26903 73.8365 1.88798 56.4035C8.95937 39.1791 43.2947 38.8371 64.2724 29.1257C84.6019 19.7145 98.6647 1.98796 122.736 0.458659C147.655 -1.12451 156.626 8.61724 178.219 16.7453C206.348 27.3336 231.996 33.953 248.594 49.8745C278.333 78.401 271.015 131.031 254.999 141.044C238.984 151.057 229.225 146.126 218.388 152.678C207.552 159.229 140.137 177.137 113.583 181.783Z"
            fill="black"
          />
        </svg>
      </div>
    </div>
  );
};
