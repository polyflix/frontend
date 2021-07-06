import React from "react";
import { Link } from "react-router-dom";
import { cn, WithClassname } from "../../../../common";
import { Typography } from "../../Typography";

type Props = WithClassname & {
  // where the card redirects
  route: string;
  // illustration on the left
  image: React.SVGProps<SVGSVGElement>;
  // title of the card
  title: string;
  // description of the card
  description: string;
};

export const CreateVideoCard: React.FC<Props> = ({
  route,
  image,
  title,
  description,
  className = "",
}) => {
  return (
    <Link
      to={route}
      className={cn(
        className,
        "h-60 flex items-center w-full xl:w-1/2 2xl:w-1/3 mb-10 lg:mb-0 border rounded-md border-white hover:bg-nx-dark"
      )}
    >
      <div className="flex items-center justify-center mx-5 xl:mx-10 h-full flex-col md:flex-row">
        {image}
        <div className="ml-5">
          <Typography
            as="h2"
            bold
            overrideDefaultClasses
            className="text-nx-red text-2xl mb-2"
          >
            {title}
          </Typography>
          <Typography
            as="p"
            overrideDefaultClasses
            className="text-white text-sm w-full"
          >
            {description}
          </Typography>
        </div>
      </div>
    </Link>
  );
};
