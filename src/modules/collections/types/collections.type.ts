import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Collection } from "../models/collections.model";
import { IVideo } from "../../videos/types/videos.type";
import { IPublisher } from "../../common/types";

export interface ICollectionForm {
  title: string;
  description: string;
  videos: videoLite[];
}

type videoLite = {
  id: string;
};

export type CollectionState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  refresh: () => void;
};

export type CollectionsWithPagination = {
  totalCount: number;
  items: Collection[];
};

export type CollectionParams = {
  page?: number;

  pageSize?: number;

  order?: string;

  slug?: string;

  title?: string;

  publisherId?: string;

  joinWithPublisher?: boolean;
};

export interface ICollection {
  id: string;
  description: string;
  title: string;
  publisherId: string;
  publishedBy: IPublisher | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
  videos: IVideo[];
}
