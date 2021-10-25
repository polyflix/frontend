import { EntityId } from '@reduxjs/toolkit'
import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { generateFilename } from '@core/helpers/file.helper'
import { CrudAbstractService } from '@core/services/crud-abstract.service'
import { MinioService } from '@core/services/minio.service'
import {
  ApiVersion,
  CrudAction,
  IApiResponse,
  WithPagination,
} from '@core/types/http.type'

import {
  videoAdded,
  videosLoading,
  videosReceived,
} from '@videos/reducers/video.slice'
import { IVideoForm } from '@videos/types/form.type'

import { Video } from '../models/video.model'

@Injectable()
export class VideoService extends CrudAbstractService<Video, IVideoForm> {
  constructor(private readonly minioService: MinioService) {
    super(ApiVersion.V1, 'videos')
  }

  async create(
    data: IVideoForm,
    isYoutube: boolean,
    videoFile?: File,
    videoThumbnailFile?: File
  ) {
    if (!isYoutube) {
      // If we have a video file, generate the a filename for it
      if (videoFile) {
        data.src = generateFilename(videoFile)
      } else {
        return this.snackbarService.createSnackbar(
          this.translate('forms.create-update.validation.video.required', {
            ns: 'videos',
          }),
          { variant: 'error' }
        )
      }

      // If we have a file for the thumbnail, generate a filename for it
      if (videoThumbnailFile) {
        data.thumbnail = generateFilename(videoThumbnailFile)
      }
    }

    // Save the video and take the result
    const { videoPutPsu, thumbnailPutPsu } = await this.save(data)
    // If upload, we have to upload some files
    // with the presigned url returned in the response
    if (!isYoutube) {
      const uploads = []

      if (videoFile && videoPutPsu) {
        uploads.push({ file: videoFile, presignedUrl: videoPutPsu })
      }

      if (videoThumbnailFile && thumbnailPutPsu) {
        uploads.push({
          file: videoThumbnailFile,
          presignedUrl: thumbnailPutPsu,
        })
      }
      await this.minioService.upload(uploads)
    }

    this.notify(CrudAction.CREATE)
  }

  async findAll(): Promise<IApiResponse<WithPagination<Video[]>>> {
    this.dispatch(videosLoading())

    const { response, status, error } = await this.httpService.get(
      this.endpoint
    )

    if (status !== StatusCodes.OK) {
      throw error
    }

    this.dispatch(videosReceived(response.items))

    return response
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(item: Video): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getById(id: EntityId): Promise<Video> {
    const { response, error, status } = await this.httpService.get(
      `${this.endpoint}/${id}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(item: Video): Promise<Video> {
    throw new Error('Method not implemented.')
  }

  async save(data: IVideoForm): Promise<Video> {
    const { response, error, status } = await this.httpService.post(
      this.endpoint,
      { body: data }
    )

    if (status !== StatusCodes.CREATED) {
      this.snackbarService.createSnackbar(error, { variant: 'error' })
      throw error
    }

    this.dispatch(videoAdded(response))

    return response
  }

  async update(id: EntityId, data: IVideoForm): Promise<void | Video> {
    const { response, error, status } = await this.httpService.put(
      `${this.endpoint}/${id}`,
      { body: data }
    )

    if (status !== StatusCodes.OK) {
      this.snackbarService.createSnackbar(error, { variant: 'error' })
      throw error
    }

    this.notify(CrudAction.UPDATE)
    return response
  }
}
