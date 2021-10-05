export type PresignedUrl = {
  tokenAccess: string;
};

export const BUCKETS = {
  VIDEOS: process.env.REACT_APP_MINIO_ENDPOINT_VIDEO || "videos",
  IMAGES: process.env.REACT_APP_MINIO_ENDPOINT_IMAGE || "images",
  SUBTITLES: process.env.REACT_APP_MINIO_ENDPOINT_SUBTITLE || "subtitles",
};

// eslint-disable-next-line
export type BUCKETS = typeof BUCKETS[keyof typeof BUCKETS];

export interface IUploadStrategy<T> {
  upload(files: T[]): Promise<T[]>;
}
