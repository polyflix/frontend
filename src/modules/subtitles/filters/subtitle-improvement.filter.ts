import { Injectable } from "@polyflix/di";
import { AbstractFilter } from "../../common/filters/abtract.filter";
import { SubtitleImprovementStatus } from "../types/subtitle-improvement.type";

export interface ISubtitleImprovementFilter {
  subtitleId?: string;
  timestamp?: number;
  isApproved?: boolean;
  status?: SubtitleImprovementStatus;
  userId?: string;
  myVideo?: boolean;
}

@Injectable()
export class SubtitleImprovementFilter extends AbstractFilter<ISubtitleImprovementFilter> {
  public buildFilters(
    filters: ISubtitleImprovementFilter | Partial<ISubtitleImprovementFilter>
  ): string {
    this.clear();
    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value);
    });
    return this.queryBuilder.toString();
  }
}
