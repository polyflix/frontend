import { IVideo } from "../types";
import { VideoPublisher } from "./video-publisher.model";
import WatchMetadata from "../../stats/models/userMeta.model";
import { Subtitle, SubtitleLanguages } from "./subtitle.model";

/**
 * Modelize the Video
 * @class Video
 */
export class Video {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _isPublished: boolean,
    private readonly _description: string,
    private readonly _slug: string,
    private readonly _thumbnail: string,
    private readonly _isPublic: boolean,
    private readonly _publisherId: string,
    private readonly _userMeta: WatchMetadata | undefined,
    private readonly _publisher: VideoPublisher | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _src: string,
    private readonly _watchCount: number,
    private readonly _previewUrl: string,
    private readonly _subtitles: Subtitle[]
  ) {}

  /**
   * Parse a JSON object to a VideoClass instance
   * @param {IVideo} json the json to parse
   * @returns {Video} an instance of Video
   */
  static fromJson(json: IVideo): Video {
    return new Video(
      json.id,
      json.title,
      json.isPublished,
      json.description,
      json.slug,
      json.thumbnail,
      json.isPublic,
      json.publisherId,
      json.userMeta && WatchMetadata.fromJson(json.userMeta),
      json.publishedBy && VideoPublisher.fromJson(json.publishedBy),
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.src,
      json.watchCount,
      json.previewUrl,
      json.subtitles
    );
  }

  /**
   * Return a video description shortened.
   * @returns {string} the video description shortened
   */
  get shortDescription(): string {
    return this._description.length > 150
      ? this._description.slice(0, 150) + "..."
      : this._description;
  }

  /**
   * Return the video id
   * @returns {string} the video id
   */
  get id(): string {
    return this._id;
  }

  /**
   * Return the video title
   * @returns {string} the video title
   */
  get title(): string {
    return this._title;
  }

  /**
   * Return true if the video is published, false otherwise
   * @returns {boolean} true if the video is published, false otherwise
   */
  get isPublished(): boolean {
    return this._isPublished;
  }

  /**
   * Return the slug (UID) of the video.
   * @returns {string} the video slug
   */
  get slug(): string {
    return this._slug;
  }

  /**
   * Return the video description.
   * @returns {string} the video description
   */
  get description(): string {
    return this._description;
  }

  /**
   * Return the thumbnail URL.
   * @returns {string} the video thumbnail URL
   */
  get thumbnail(): string {
    return this._thumbnail;
  }

  /**
   * Return true if the video is public, false otherwise
   * @returns {boolean} true if the video is public, false otherwise
   */
  get isPublic(): boolean {
    return this._isPublic;
  }

  /**
   * Return watching meta data over video if any
   * @returns {WatchMetadata} Complete meta data based on user
   * @returns {null} Nothing stored so returns nothing
   */
  get userMeta(): WatchMetadata | undefined {
    return this._userMeta;
  }

  /**
   * Return the video publisher
   * @returns {VideoPublisher} the video publisher
   */
  get publisher(): VideoPublisher | null {
    return this._publisher;
  }

  /**
   * Return the video publisher
   * @returns {string} the video URL
   */
  get src(): string {
    return this._src;
  }

  /**
   * Return the video publisher
   * @returns {string} the video URL
   */
  get previewUrl(): string {
    return this._previewUrl;
  }

  private get link(): string {
    return `/videos/${this._slug}`;
  }

  get subtitles(): Subtitle[] {
    return this._subtitles;
  }

  get watchCount(): number {
    return this._watchCount;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  /**
   * Return the video stream link.
   * @returns {string} the stream link for the video
   */
  getStreamLink(): string {
    return `${this.link}`;
  }

  /**
   * Return the video information link
   * @returns {string} the video info link
   */
  getInfoLink(): string {
    return this.link;
  }

  /**
   * Return the edit link for the video
   * @returns {}
   */
  getEditLink(): string {
    return `/videos/update/${this._slug}`;
  }

  /**
   * Returns the subtitles linked to the selected language
   * @returns {Subtitle[]} the subtitles array
   * @returns {undefined} if no subtitles were found in this language
   */
  getSubtitles(lang: SubtitleLanguages): Subtitle | undefined {
    return this._subtitles.find((sub) => sub.lang === lang);
  }
}
