import React from "react";
import { Link } from "react-router-dom";
import { SubtitleImprovement } from "../models/subtitle-improvement.model";

type AvatarProps = {
  subtitleImprovement: SubtitleImprovement;
};
export const Avatar: React.FC<AvatarProps> = ({ subtitleImprovement }) => {
  return (
    <div className="flex items-center flex-1">
      <img
        className="cursor-pointer w-10 h-10 rounded-3xl mr-3"
        src={
          subtitleImprovement?.createdBy?.profilePicture &&
          subtitleImprovement?.createdBy?.profilePicture !== ""
            ? subtitleImprovement?.createdBy?.profilePicture
            : "https://i.imgur.com/tdi3NGa.png"
        }
        alt="avatar"
      />
      <div className="overflow-hidden">
        <div>
          <Link
            to={`/profile/videos/${subtitleImprovement?.createdBy?.id}`}
            className="font-bold text-red-300 cursor-pointer hover:underline"
          >
            {`${subtitleImprovement?.createdBy?.firstName} ${subtitleImprovement?.createdBy?.lastName}`}
          </Link>
        </div>
        <p className="text-white leading-normal">
          {new Date(subtitleImprovement?.createdAt)?.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
