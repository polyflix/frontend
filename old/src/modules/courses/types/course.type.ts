import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Course } from "../models";
import { IPublisher } from "../../common/types";
import { ICollection } from "../../collections/types";
import { Visibility } from "../../common/types/crud.type";

export interface ICourseForm {
  title: string;
  content: string;
  collections: collectionLite[];
  draft: boolean;
  visibility: Visibility;
}

type collectionLite = {
  id: string;
};

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
  draft: boolean;
  visibility: Visibility;
}
