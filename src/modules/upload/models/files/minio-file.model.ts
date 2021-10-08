import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { MINIO_URL } from '../../../common/constants/minio.constant'
import { Bucket } from '../../types/upload.type'

export class MinioFile {
  private minioFilename: string

  constructor(
    protected bucket: Bucket,
    protected file: File,
    protected field: string
  ) {
    this.minioFilename = this.generateRandomName()
  }

  /**
   * Get the file name
   *
   * @returns {string}
   */
  getFilename(): string {
    return this.file.name
  }

  /**
   * Get the minio bucket name where the
   * file will be uploaded
   *
   * @returns {string}
   */
  getBucketName(): string {
    return this.bucket
  }

  /**
   * Get the file name stored in minio
   *
   * @returns {string}
   */
  getMinioFilename(): string {
    return this.minioFilename
  }

  /**
   * Returns the file binary
   *
   * @returns {string}
   */
  getBlob(): File {
    return this.file
  }

  /**
   * Get the field related to the form
   *
   * @returns {string}
   */
  getField(): string {
    return this.field
  }

  /**
   * Get the file url stored in minio
   *
   * @returns {string}
   */
  getFileURL(): string {
    return `${MINIO_URL}/${this.bucket}/${this.minioFilename}`
  }

  /**
   * Helper to get the extension of a file
   *
   * @returns {string}
   */
  private getExtension(): string {
    return path.extname(this.file.name)
  }

  /**
   * Generate a unique id that is used to upload
   * a file with an unique name in minio
   *
   * @returns {string}
   */
  private generateRandomName(): string {
    return `${uuidv4()}${this.getExtension()}`
  }
}
