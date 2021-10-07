import React from "react";
import { DEFAULT_AVATAR_URL } from "../../../common/constants/app.constant";

type Props = {
  pictureUrl?: string;
  username?: string;
};

/**
 * Show user avatar as image
 */
export const ProfileAvatar: React.FC<Props> = ({ username, pictureUrl }) => {
  return (
    <img
      className="cursor-pointer w-10 h-10 rounded-3xl mr-3"
      src={pictureUrl ?? DEFAULT_AVATAR_URL}
      alt={username ? `${username} avatar` : "Someone avatar"}
    />
  );
};
