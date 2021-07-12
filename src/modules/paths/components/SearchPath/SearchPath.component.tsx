import React, { useState } from "react";
import { CourseList } from "../CourseList/CourseList.component";
import { motion } from "framer-motion";
import { WithClassname, WithMotion } from "../../../common";
import { useInjection } from "@polyflix/di";
import { Course, CourseService } from "../../../courses";

type Props = WithClassname &
  WithMotion & { addCourse: (course: Course) => void; placeholder: string };

export const SearchPath: React.FC<Props> = ({
  addCourse,
  placeholder,
  ...rest
}) => {
  const courseService = useInjection<CourseService>(CourseService);

  const [input, setInput] = useState<string>("");
  const [courseList, setCourseList] = useState<Course[]>([]);

  const onClickCourse = (course: Course) => {
    addCourse(course);
    setInput("");
    setCourseList([]);
  };

  const search = async (title: string) => {
    let paginatedCourses = await courseService.getCourses({
      title,
      exact: false,
    });
    setInput(title);
    setCourseList(paginatedCourses.items);
  };

  return (
    <motion.div
      {...rest}
      className="flex flex-col divide-y-2 divide-gray-300 dark:bg-nx-white rounded-md overflow-hidden col-span-2 px-2"
    >
      <input
        type="text"
        className="dark:bg-nx-white focus:outline-none py-3 px-3 font-display"
        value={input}
        onChange={(e) => search(e.target.value)}
        placeholder={placeholder}
      />
      {input && courseList.length !== 0 ? (
        <CourseList
          onClickCourse={onClickCourse}
          courseList={courseList}
          className="col-span-2"
        />
      ) : null}
    </motion.div>
  );
};
