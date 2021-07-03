import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Video } from "../models/video.model";
import { IWatchMetadata } from "../../stats/types/userMeta.type";
import { Subtitle } from "../models";

export interface IVideoForm {
  hasSubtitle: boolean;
  title: string;
  description: string;
  thumbnail: string;
  isPublic: boolean;
  isPublished: boolean;
  src: string;
  previewUrl: string;
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

export interface IVideoPublisher {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IVideo {
  previewUrl: string;
  src: string;
  isPublic: boolean;
  isPublished: boolean;
  description: string;
  id: string;
  title: string;
  publisherId: string;
  publishedBy: IVideoPublisher | null;
  userMeta: IWatchMetadata | undefined;
  watchCount: number;
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
