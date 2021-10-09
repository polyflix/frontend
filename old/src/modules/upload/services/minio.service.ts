import { Inject, Injectable } from "@polyflix/di";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services";
import { MinioFile } from "../models/files/minio-file.model";
import { IUploadStrategy, PresignedUrl } from "../types/upload.type";
import { SubtitleLanguages } from "../../videos";

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
        const { tokenAccess: presignedUrl } =
          await this.getVideoPutPresignedUrl(
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
  private async getVideoPutPresignedUrl(
    fileName: string,
    bucketName: string
  ): Promise<PresignedUrl> {
    const { status, response, error } = await this.httpService.get(
      `/token/video/upload?fileName=${fileName}&bucketName=${bucketName}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return response;
  }

  /**
   *	Request a preSignedUrl to see video content
   *
   * @param {string} videoId -- ID of video
   * @returns {Promise<PresignedUrl>}
   */
  public async getVideoPresignedUrl(videoId: string): Promise<PresignedUrl> {
    const { status, response, error } = await this.httpService.get(
      `/token/video/${videoId}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return response;
  }

  /**
   *	Request a preSignedUrl to see subtitle content
   *
   * @param {string} videoId -- ID of video
   * @param {SubtitleLanguages} language -- Language needed
   * @returns {Promise<PresignedUrl>}
   */
  public async getSubtitlePresignedUrl(
    videoId: string,
    language: SubtitleLanguages
  ): Promise<PresignedUrl> {
    const { status, response, error } = await this.httpService.get(
      `/token/video/${videoId}/subtitle/${language}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return response;
  }
}
