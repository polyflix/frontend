import { WithClassname } from "@core/types/props.type";
import { cn } from "@core/utils";
import User from "@data/models/user.model";
import Typography from "@ui/components/Typography/Typography.component";
import React from "react";

type Props = WithClassname & {
  /** The user we want to display the avatar */
  user: User;
};

/**
 * A simple component to display an avatar for the user.
 * Actually supports only user initials (like : TG)
 */
const Avatar: React.FC<Props> = ({ user, className = "" }) => {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center bg-nx-dark",
        className
      )}
    >
      <Typography
        as="span"
        bold
        overrideDefaultClasses
        className="text-sm text-nx-white"
      >
        {user.initials}
      </Typography>
    </div>
  );
};

export default Avatar;
