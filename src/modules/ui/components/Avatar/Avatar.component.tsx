import React from "react";
import { WithClassname } from "../../../common/types/props.type";
import { cn } from "../../../common/utils/classes.util";
import { User } from "../../../users/models/user.model";
import { Image } from "../Image/Image.component";

type Props = WithClassname & {
  /** The user we want to display the avatar */
  user: User;
};

/**
 * A simple component to display an avatar for the user.
 * Actually supports only user initials (like : TG)
 */
export const Avatar: React.FC<Props> = ({ user, className = "" }) => {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center bg-nx-dark",
        className
      )}
    >
      <Image
        src={
          user.profilePicture && user.profilePicture !== ""
            ? user.profilePicture
            : "https://i.imgur.com/tdi3NGa.png"
        }
        className="text-sm text-nx-white rounded-3xl"
        alt={`Profile Picture`}
      />
    </div>
  );
};
