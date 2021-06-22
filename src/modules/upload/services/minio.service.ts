import { Inject, Injectable } from "@polyflix/di";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services";
import { MinioFile } from "../models/files/minio-file.model";
import { IUploadStrategy, PresignedUrl } from "../types/upload.type";

@Injectable()
export class MinioService implements IUploadStrategy<MinioFile> {
  constructor(
    @Inject("minio.url") private readonly minioUrl: string,
    private readonly httpService: HttpService
  ) {}

  /**
   * Upload a list of files into minio
   *
   * @param files - Files to upload
   * @returns {Promise<MinioFile[]>}
   */
  async upload(files: MinioFile[]): Promise<MinioFile[]> {
    try {
      for (const file of files) {
        const { presignedUrl } = await this.getPresignedUrl(
          file.getMinioFilename(),
          file.getBucketName()
        );
        await axios.put(presignedUrl, file.getBlob());
      }
      return files;
    } catch (error) {
      throw error;
    }
  }

  /**
   *	Get the presignedUrl in order to upload a file
   *
   * @param fileName - Name given to the file
   * @param bucketName - Upload bucket
   * @returns {Promise<PresignedUrl>}
   */
  private async getPresignedUrl(
    fileName: string,
    bucketName: string
  ): Promise<PresignedUrl> {
    const { status, response, error } = await this.httpService.get(
      `/upload/presignedUrl?fileName=${fileName}&bucketName=${bucketName}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return response;
  }
}
