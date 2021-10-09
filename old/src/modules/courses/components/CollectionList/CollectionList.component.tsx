import React from "react";
import { motion } from "framer-motion";
import { WithClassname, WithMotion } from "../../../common/types/props.type";
import { cn } from "../../../common/utils/classes.util";
import { Collection } from "../../../collections/models/collections.model";

type Props = WithClassname &
  WithMotion & {
    collectionList?: Collection[];
    onClickCollection: (collection: Collection) => void;
  };

export const CollectionList: React.FC<Props> = ({
  collectionList = [],
  className = "",
  onClickCollection,
  ...rest
}) => {
  return (
    <motion.div {...rest} className={cn("flex flex-col", className)}>
      <ul className="dark:bg-nx-white focus:outline-none py-1 px-1 space-y-2 font-display">
        {collectionList.map((data) => {
          return (
            <li
              className="rounded-md hover:bg-gray-300 py-2 px-4 cursor-pointer"
              onClick={() => onClickCollection(data)}
            >
              {data.title}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};
