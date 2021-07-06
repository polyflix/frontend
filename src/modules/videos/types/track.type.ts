export interface Track
  extends Pick<HTMLTrackElement, "kind" | "label" | "src" | "default"> {
  srcLang: string;
}
