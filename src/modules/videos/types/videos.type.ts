import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Video } from "../models/video.model";

export interface IVideoForm {
  title: string;
  description: string;
  thumbnail: string;
  isPublic: boolean;
  isPublished: boolean;
  videoURL: string;
  videoPreviewURL: string;
}

export type VideoState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  triggerReload: () => void;
};

export type VideosWithPagination = {
  pages: number;
  videos: Video[];
};

export interface IVideoPublisher {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IVideo {
  videoPreviewURL: string;
  videoURL: string;
  isPublic: boolean;
  isPublished: boolean;
  description: string;
  id: string;
  title: string;
  publisherId: string;
  publishedBy: IVideoPublisher | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
  thumbnail: string;
}
