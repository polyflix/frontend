import React from "react";
import { Typography } from "../../ui";

type Props = {
  title: string;
  number: string;
};

/**
 * Tile used in the statistic page to show some heading stats
 * This component MUST be used into a grid for the best rendering
 * @param {string} title
 * @param {string} number -- Will be parsed properly
 * @constructor
 */
export const StatTile: React.FC<Props> = ({ title, number }) => {
  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-4 text-center flex flex-col justify-center">
      <Typography light as={"h2"} className="text-md">
        {title}
      </Typography>
      <Typography bold as={"p"} className="text-2xl pt-3">
        {number}
      </Typography>
    </div>
  );
};
