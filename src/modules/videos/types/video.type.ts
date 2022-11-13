export enum PlayerVideoSource {
  YOUTUBE = 'youtube',
  INTERNAL = 'internal',
  UNKNOWN = 'unknown',
}

export interface YouTubeVideoMetadata {
  title: string
  description: string
  thumbnail: string
}
