export interface Track
  extends Pick<
    HTMLTrackElement,
    "kind" | "label" | "srclang" | "src" | "default"
  > {}
