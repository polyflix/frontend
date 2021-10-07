import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../../common";

type Props = {
  link?: string;
  username?: string;
  lowercase?: boolean;
};

/**
 * Show full username of user if defined, else will show Deleted account translation
 * When full username is defined will put a link onto it
 */
export const ProfileUsername: React.FC<Props> = ({
  link,
  username,
  lowercase = false,
}) => {
  const { t } = useTranslation();

  const textStyle = cn("font-bold text-red-300", lowercase && "lowercase");
  const StyledText: React.FC = ({ children }) => (
    <span className={textStyle}>{children}</span>
  );

  if (username && !link) return <StyledText>{username}</StyledText>;
  else if (username && link) {
    return (
      <Link
        to={link}
        className={cn(textStyle, "cursor-pointer hover:underline")}
      >
        {username}
      </Link>
    );
  } else return <StyledText>{t("common:deletedAccount")}</StyledText>;
};
