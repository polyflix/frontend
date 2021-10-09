import { AlertType } from "../../ui/components/Alert/Alert.component";
import { Video } from "../models/video.model";
import { IWatchMetadata } from "../../stats/types/userMeta.type";
import { SubtitleLanguages } from "../models";
import { IPublisher } from "../../common/types";
import { Tag } from "../../tags/models/tag.model";
import { tagLite } from "../../tags/types/tag.type";
import { Attachment } from "../../common/models/attachments.model";
import { IAttachment } from "../../common/types/attachments.type";
import { Visibility } from "../../common/types/crud.type";

export enum VideoSource {
  YOUTUBE = "youtube",
  INTERNAL = "internal",
  UNKNOWN = "unknown",
}

export interface IVideoForm {
  hasSubtitle: boolean;
  title: string;
  description: string;
  thumbnail: string;
  draft: boolean;
  visibility: Visibility;
  src: string;
  tags: tagLite[];
  attachments: Attachment[];
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
  source: string;
  sourceType: VideoSource;
  draft: boolean;
  visibility: Visibility;
  description: string;
  id: string;
  title: string;
  publisherId: string;
  publishedBy: IPublisher | null;
  userMeta: IWatchMetadata | undefined;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  thumbnail: string;
  availableLanguages: SubtitleLanguages[];
  tags: Tag[];
  attachments: IAttachment[];
}

export enum ProviderType {
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
  VIDEO = "video",
  UNKNOWN = "unknown",
}
