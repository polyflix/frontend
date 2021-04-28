import { PlayIcon } from "@heroicons/react/solid";
import React from "react";
import { Link } from "react-router-dom";
import Typography from "../../Typography/Typography.component";
import Button from "../Button.component";

type Props = {
  playLink: string;
};

const PlayButton: React.FC<Props> = ({ playLink }) => {
  return (
    <Link to={playLink}>
      <Button
        as="button"
        className="flex items-center bg-nx-white text-nx-dark"
      >
        <PlayIcon className="w-6" />{" "}
        <Typography
          overrideDefaultClasses
          className="ml-1 text-sm md:text-base"
          as="span"
        >
          Play
        </Typography>
      </Button>
    </Link>
  );
};

export default PlayButton;
