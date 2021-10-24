export enum Bucket {
  IMAGES = 'images',
  VIDEOS = 'videos',
  SUBTITLES = 'subtitles',
}

export interface IUploadStrategy<T> {
  upload(files: T[]): Promise<T[]>
}
