export interface IWatchMetadata {
  watchedSeconds: number;
  watchedPercent: number;
  isWatched: boolean;
}

export type UpsertUserVideoMeta = {
  videoId: string;
  watchedSeconds: number;
  watchedPercent: number;
};
