import { HttpService } from "../../common/services";
import { Token } from "../../authentication";
import {
  SYNC_RATE_LIMITER_MAX,
  SYNC_RATE_LIMITER_MIN,
} from "../../common/constants/stats.constant";
import { UpsertUserVideoMeta } from "../types/userMeta.type";
import { Injectable } from "@polyflix/di";

@Injectable()
export class StatsService {
  private _lastSync: number | null = null;
  private _timer: NodeJS.Timeout | null = null;

  constructor(private readonly httpService: HttpService) {}

  /**
   * The strategy behind it is: best effort. If the call
   * fails, it is not important as many others will succeed
   *
   * On top of that, this service might be used in the future
   * to update more stats than just `watchTime`
   * @param {UpsertUserVideoMeta} updateData -- Dats to upsert
   * @param {Token} token -- user token
   */
  public async updateSync(updateData: UpsertUserVideoMeta, token: Token) {
    if (this._lastSync && this._lastSync + SYNC_RATE_LIMITER_MIN > Date.now())
      return;

    // Threshold to prevent too low data
    if (updateData.watchedSeconds < 5) return;

    // We round the watched% to 2 digits
    updateData.watchedPercent =
      Math.round(updateData.watchedPercent * 100) / 100;
    updateData.watchedSeconds =
      Math.round(updateData.watchedSeconds * 100) / 100;

    try {
      await this.httpService.post("/stats/watchtime", {
        body: updateData,
      });
      console.debug(
        `Updated stats watchtime on ${updateData.watchedSeconds} seconds (${updateData.watchedPercent}%)`
      );
    } catch (e) {
      console.debug("Failed to send watchtime...");
    }

    this._lastSync = Date.now();
  }

  /**
   * Run interval in order to keep sync data if no
   * event is triggered by user
   * @param {function} callback
   */
  public startTimer(callback: () => void) {
    if (this._timer) this.stopTimer();

    this._timer = setInterval(callback, SYNC_RATE_LIMITER_MAX);
  }

  /**
   * Cancel current stats syncer, will throw error in case it is not
   * started & stopped properly
   */
  public stopTimer() {
    if (!this._timer)
      throw new Error("[StatsService] Cannot stop a timer which isn't started");

    clearInterval(this._timer);
    this._timer = null;
  }
}