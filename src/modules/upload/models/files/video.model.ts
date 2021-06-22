import { Bucket } from "../../types/upload.type";
import { MinioFile } from "./minio-file.model";

export class VideoFile extends MinioFile {
  constructor(file: File, field: string) {
    super(Bucket.VIDEOS, file, field);
  }
}
