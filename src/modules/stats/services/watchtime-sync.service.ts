import {
  SYNC_RATE_LIMITER_MAX,
  SYNC_RATE_LIMITER_MIN,
} from '@stats/constants/stats.constant'
import { UpsertUserVideoMeta } from '@stats/types/userMeta.type'

import { Injectable } from '@polyflix/di'

import { ApiService } from '@core/services/api.service'
import { HttpService } from '@core/services/http.service'
import { ApiVersion } from '@core/types/http.type'

@Injectable()
export class WatchtimeSyncService {
  private _lastSync: number | null = null

  private _timer: NodeJS.Timeout | null = null

  protected endpoint: string

  constructor(
    private readonly httpService: HttpService,
    private readonly apiService: ApiService
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V1)}/auth`
  }

  /**
   * The strategy behind it is: best effort. If the call
   * fails, it is not important as many others will succeed
   *
   * On top of that, this service might be used in the future
   * to update more stats than just `watchTime`
   * @param {UpsertUserVideoMeta} updateData -- Dats to upsert
   * @param {Token} token -- user token
   */
  public async updateSync(updateData: UpsertUserVideoMeta) {
    if (
      (this._lastSync && this._lastSync + SYNC_RATE_LIMITER_MIN > Date.now()) ||
      !this._timer ||
      (this._lastSync && !this._timer)
    )
      return

    // Threshold to prevent too low data
    if (updateData.watchedSeconds < 5) return

    // This update of value must be here, so we don't have multiple call at once
    // as it is an async method
    this._lastSync = Date.now()

    // We round the watched% to 2 digits
    updateData.watchedPercent =
      Math.round(updateData.watchedPercent * 100) / 100
    updateData.watchedSeconds =
      Math.round(updateData.watchedSeconds * 100) / 100

    try {
      await this.httpService.post('/stats/watchtime', {
        body: updateData,
      })
    } catch (e) {
      console.debug('Failed to send watchtime...')
    }
  }

  /**
   * Run interval in order to keep sync data if no
   * event is triggered by user
   * @param {function} callback
   */
  public startTimer(callback: () => void) {
    if (this._timer) this.stopTimer()

    this._timer = setInterval(callback, SYNC_RATE_LIMITER_MAX)
  }

  /**
   * Cancel current stats syncer, will throw error in case it is not
   * started & stopped properly
   */
  public stopTimer() {
    if (!this._timer)
      throw new Error("[StatsService] Cannot stop a timer which isn't started")

    clearInterval(this._timer)
    this._timer = null
  }

  /**
   * Add or remove like from video
   * with the id videoId
   */
  public async likeVideo(videoId: string) {
    await this.httpService.patch('/stats/like', {
      body: {
        videoId,
      },
    })
  }
}
