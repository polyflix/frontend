import { Bucket } from "../../types/upload.type";
import { MinioFile } from "./minio-file.model";

export class ImageFile extends MinioFile {
  constructor(file: File, field: string) {
    super(Bucket.IMAGES, file, field);
  }

  /**
   * Get the thumbnail preview in video form update mode
   *
   * @returns {string}
   */
  getPreview(): string {
    return URL.createObjectURL(this.file);
  }
}
