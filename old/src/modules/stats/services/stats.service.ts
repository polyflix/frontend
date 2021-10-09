import { Injectable } from "@polyflix/di";
import { HttpService } from "../../common/services";
import { IVideoStatsFilter } from "../filters/date.filter";
import { StatView } from "../types/StatView.type";

@Injectable()
export class StatsService {
  constructor(private readonly httpService: HttpService) {}

  public async getVideoStats(
    slug: string,
    filters: IVideoStatsFilter = {}
  ): Promise<StatView> {
    const urlParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
    const searchQuery = urlParams.toString();

    let url = `/stats/video/${slug}`;
    if (searchQuery !== "" && searchQuery) {
      url += `?${searchQuery}`;
    }

    const { status, response, error } = await this.httpService.get(url);
    if (status !== 200) {
      throw error;
    }
    return response;
  }
}
