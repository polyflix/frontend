import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Course } from "../models";
import { IPublisher } from "../../common/types";
import { ICollection } from "../../collections/types";

export interface ICourseForm {
  title: string;
  content: string;
}

export type CourseState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  refresh: () => void;
};

export type CoursesWithPagination = {
  totalCount: number;
  items: Course[];
};

export interface ICourse {
  content: string;
  id: string;
  title: string;
  publisherId: string;
  publishedBy: IPublisher | null;
  collections: ICollection[];
  createdAt: string;
  updatedAt: string;
  slug: string;
}
