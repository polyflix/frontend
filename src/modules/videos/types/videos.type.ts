import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Video } from "../models/video.model";
import { IWatchMetadata } from "../../stats/types/userMeta.type";
import { Subtitle } from "../models";
import { IPublisher } from "../../common/types";

export interface IVideoForm {
  hasSubtitle: boolean;
  title: string;
  description: string;
  thumbnail: string;
  isPublic: boolean;
  isPublished: boolean;
  src: string;
}

export type VideoState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  triggerReload: () => void;
};

export type VideosWithPagination = {
  totalCount: number;
  items: Video[];
};

export interface IVideo {
  src: string;
  isPublic: boolean;
  isPublished: boolean;
  description: string;
  id: string;
  title: string;
  publisherId: string;
  publishedBy: IPublisher | null;
  userMeta: IWatchMetadata | undefined;
  watchCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  thumbnail: string;
  subtitles: Subtitle[];
}

export enum ProviderType {
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
  VIDEO = "video",
  UNKNOWN = "unknown",
}
