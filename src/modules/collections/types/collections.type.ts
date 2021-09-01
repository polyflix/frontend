import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Collection } from "../models/collections.model";
import { IVideo } from "../../videos/types/videos.type";
import { IPublisher } from "../../common/types";
import { Tag } from "../../tags/models/tag.model";
import { tagLite } from "../../tags/types/tag.type";

export interface ICollectionForm {
  title: string;
  description: string;
  videos: videoLite[];
  availability: string;
  passwords: AccessPassword[];
  tags: tagLite[];
}

export type AccessPassword = {
  name: string;
  password: string;
  expiration: string;
  collectionId: string;
};

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

  password?: string;

  availability?: string;

  tags?: string;
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
  availability: string;
  videos: IVideo[];
  passwords: AccessPassword[];
  tags: Tag[];
}
