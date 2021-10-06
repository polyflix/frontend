import { IVideo, VideoSource } from "../types";
import WatchMetadata from "../../stats/models/userMeta.model";
import { SubtitleLanguages } from "./subtitle.model";
import { Publisher } from "../../common/models";
import { PolyflixLanguage } from "../../common/types/language.type";
import { getSubtitleLanguageFromPolyflix } from "../../common/utils/language.util";
import { Tag } from "../../tags/models/tag.model";
import { Attachment } from "../../common/models/attachments.model";
import { Visibility } from "../../common/types/crud.type";

/**
 * Modelize the Video
 * @class Video
 */
export class Video {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _slug: string,
    private readonly _thumbnail: string,
    private readonly _draft: boolean,
    private readonly _visibility: Visibility,
    private readonly _publisherId: string,
    private readonly _userMeta: WatchMetadata | undefined,
    private readonly _publisher: Publisher | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _source: string,
    private readonly _sourceType: VideoSource,
    private readonly _views: number,
    private _likes: number,
    private readonly _availableLanguages: SubtitleLanguages[],
    private readonly _tags: Tag[],
    private readonly _attachments: Attachment[]
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
      json.description,
      json.slug,
      json.thumbnail,
      json.draft,
      json.visibility,
      json.publisherId,
      json.userMeta && WatchMetadata.fromJson(json.userMeta),
      json.publishedBy && Publisher.fromJson(json.publishedBy),
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.source,
      json.sourceType,
      json.views,
      json.likes,
      json.availableLanguages,
      json.tags && json.tags.map(Tag.fromJson),
      json.attachments?.map((attachment) => Attachment.fromJson(attachment))
    );
  }

  get availableLanguages(): SubtitleLanguages[] {
    return this._availableLanguages;
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

  get shortTitle(): string {
    const MAX_TITLE_LENGTH = 40;
    return this._title.length > MAX_TITLE_LENGTH
      ? this._title.slice(0, MAX_TITLE_LENGTH) + "..."
      : this._title;
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
   * return a string of the enum values
   * @returns {Visibility} string of the value
   */
  get visibility(): Visibility {
    return this._visibility;
  }

  /**
   * Return true if the video is a draft, false otherwise
   * @returns {boolean} true if the video is a draft, false otherwise
   */
  get draft(): boolean {
    return this._draft;
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
   * @returns {Publisher} the video publisher
   */
  get publisher(): Publisher | null {
    return this._publisher;
  }

  /**
   * Return the video streaming URL when it is a youtube URL or
   * unknown source
   * @returns {string} the video URL
   */
  get src(): string {
    switch (this._sourceType) {
      case VideoSource.YOUTUBE:
        return `https://www.youtube-nocookie.com/embed/${this._source}`;
      default:
        return this._source;
    }
  }

  get srcRaw(): string {
    return this._source;
  }

  get srcType(): VideoSource {
    return this._sourceType;
  }

  private get link(): string {
    return `/watch?v=${this._slug}`;
  }

  get views(): number {
    return this._views;
  }

  get likes(): number {
    return this._likes;
  }

  set likes(nbLike: number) {
    this._likes = nbLike;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get tags(): Tag[] {
    return this._tags;
  }

  /**
   * Returns attachments for a video
   * @returns {Attachment[]} List of attachments
   */
  get attachments(): Attachment[] | [] {
    return this._attachments;
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
   * Returns a link to go to statistics page
   */
  getStatsLink(): string {
    return `/videos/${this._slug}/statistics`;
  }

  /**
   * Return the edit link for the video
   * @returns {}
   */
  getEditLink(): string {
    if (this._sourceType === VideoSource.INTERNAL)
      return `/videos/update/${this._slug}?type=upload`;
    return `/videos/update/${this._slug}`;
  }

  /**
   * Returns languages available for a video
   * @returns {SubtitleLanguages[]} List of available languages
   */
  getSubtitleLanguages(): SubtitleLanguages[] {
    return this._availableLanguages;
  }

  /**
   * When multiple languages are available, do a Best Effort to find a matching
   * language
   * @param {PolyflixLanguage} currentLang
   */
  selectProperLanguage(
    currentLang: PolyflixLanguage
  ): SubtitleLanguages | undefined {
    const languages = this.getSubtitleLanguages();
    if (languages.length === 0) return;
    // Can't use languages[0], as we don't want index error if it is not as 0
    else if (languages.length === 1) return languages.find((_) => true);

    return (
      languages.find(
        (l) => l === getSubtitleLanguageFromPolyflix(currentLang)
      ) ?? languages.find((_) => true)
    );
  }
}
