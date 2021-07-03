import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Course } from "../models";
import { IPublisher } from "../../common/types";

export interface ICourseForm {
  title: string;
  content: string;
}

export type CourseState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  triggerReload: () => void;
};

export type CoursesWithPagination = {
  totalCount: number;
  items: Course[];
  // watchedCourses: Course[];
  // watchingCourses: Course[];
};

export interface ICourse {
  content: string;
  id: string;
  title: string;
  publisherId: string;
  publishedBy: IPublisher | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
}
