import { SubtitleLanguages } from '@subtitles/types/subtitle.type'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import type { TFunction } from 'react-i18next'

import { Inject, Injectable } from '@polyflix/di'

import { APP_DISPATCHER, APP_TRANSLATION } from '@core/constants/app.constant'
import { PresignedURL } from '@core/models/presigned-url.model'
import {
  end,
  resetProgress,
  setProgress,
  start,
} from '@core/reducers/file-upload.slice'
import type { AppDispatch } from '@core/store'
import { ApiVersion } from '@core/types/http.type'

import { ApiService } from './endpoint.service'
import { HttpService } from './http.service'
import { SnackbarService } from './snackbar.service'

@Injectable()
export class MinioService {
  protected endpoint: string

  constructor(
    private snackbarService: SnackbarService,
    @Inject(APP_TRANSLATION) private readonly translate: TFunction,
    @Inject(APP_DISPATCHER) private readonly dispatch: AppDispatch,
    private readonly apiService: ApiService,
    private readonly httpService: HttpService
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V1)}/token`
  }

  /**
   * Upload files on Minio.
   * @param files
   */
  async upload(
    files: { presignedUrl: PresignedURL; file: File }[]
  ): Promise<void> {
    // Dispatch a start action to notify our upload state that we will upload files
    this.dispatch(start())
    for (const { file, presignedUrl } of files) {
      try {
        await axios.put(presignedUrl.tokenAccess, file, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            // Update the progress of the file in the state
            this.dispatch(setProgress({ file, progress: percentCompleted }))
          },
        })

        // reset the progress when the file is successfully uploaded
        this.dispatch(resetProgress())
      } catch (error) {
        console.error(error)
        this.snackbarService.createSnackbar(
          this.translate('forms.create-update.errors.upload', { ns: 'videos' }),
          { variant: 'error' }
        )
        throw error
      } finally {
        // Update the state to complete uploading
        this.dispatch(end())
      }
    }
  }

  /**
   *	Request a preSignedUrl to see video content
   *
   * @param {string} slug -- slug of video
   * @returns {Promise<PresignedUrl>}
   */
  public async getVideoPresignedUrl(slug: string): Promise<PresignedURL> {
    const { status, response, error } = await this.httpService.get(
      `${this.apiService.endpoint(ApiVersion.V2)}/videos/${slug}/token`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
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
  ): Promise<PresignedURL> {
    const { status, response, error } = await this.httpService.get(
      `${this.endpoint}/video/${videoId}/subtitle/${language}`
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return response
  }
}
