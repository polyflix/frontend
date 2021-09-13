import { Link } from "react-router-dom";
import { Tag } from "../models/tag.model";

export const TagBadge: React.FC<{
  tag: Tag;
}> = ({ tag }) => {
  return (
    <Link
      to={"/search/" + tag.label}
      style={{
        ...(tag.color !== "#000000" && {
          background: tag.color,
          color: Tag.invertColor(tag.color),
        }),
      }}
      className={`py-1 px-4 mr-2 rounded-md text-lg w-fit inline-block border-2 ${
        tag.color === "#000000" ? "border-nx-white" : "border-black"
      } hover:border-nx-red`}
    >
      {tag.label}
    </Link>
  );
};
