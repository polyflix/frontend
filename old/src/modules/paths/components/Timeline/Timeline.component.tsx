import { motion } from "framer-motion";
import React from "react";
import { NoData } from "../../../ui/components/NoData/NoData.component";
import { OrderedCourse } from "../../models";
import { Courseline } from "./Courseline.component";

type Props = {
  courses: OrderedCourse[];
};

export const Timeline: React.FC<Props> = ({ courses }) => {
  return courses ? (
    <>
      <motion.div className="w-full h-full bg-black bg-opacity-50 flex flex-col justify-center px-5">
        <ul className="rounded-3xl bg-black bg-opacity-50 p-2 sm:p-5 xl:p-6">
          {courses.map((course, index) => {
            let position: "single" | "first" | "last" | "default";
            if (courses.length === 1) {
              position = "single";
            } else if (index === 0) {
              position = "first";
            } else if (index === courses.length - 1) {
              position = "last";
            } else {
              position = "default";
            }
            return (
              <Courseline
                key={course.order}
                position={position}
                course={course}
              ></Courseline>
            );
          })}
        </ul>
      </motion.div>
    </>
  ) : (
    <NoData />
  );
};
