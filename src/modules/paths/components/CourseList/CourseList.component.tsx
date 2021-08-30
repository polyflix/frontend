import React from 'react';
import { motion } from 'framer-motion';
import { WithClassname, WithMotion } from '../../../common/types/props.type';
import { cn } from '../../../common/utils/classes.util';
import { Course } from '../../../courses/models/course.model';

type Props = WithClassname &
  WithMotion & {
    courseList?: Course[]
    onClickCourse: (course: Course) => void
  }

export const CourseList: React.FC<Props> = ({
  courseList = [],
  className = '',
  onClickCourse,
  ...rest
}) => (
  <motion.div {...rest} className={cn('flex flex-col', className)}>
    <ul className="dark:bg-nx-white focus:outline-none py-1 px-1 space-y-2 font-display">
      {courseList.map((data) => (
        <li
          className="rounded-md hover:bg-gray-300 py-2 px-4 cursor-pointer"
          onClick={() => onClickCourse(data)}
        >
          {data.title}
        </li>
      ))}
    </ul>
  </motion.div>
);
