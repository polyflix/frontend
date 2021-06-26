import { Injectable } from "@polyflix/di";
import { AbstractFilter } from "../../common/filters/abtract.filter";
import { PaginationFilter } from "../../common/types/filter.type";

export interface IVideoFilter extends PaginationFilter {
  order?: string;
  slug?: string;
  title?: string;
  authorId?: string;
  isPublished?: boolean;
  isPublic?: boolean;
  isWatched?: boolean;
  isWatching?: boolean;
}

@Injectable()
export class VideoFilter extends AbstractFilter<IVideoFilter> {
  public buildFilters(filters: IVideoFilter | Partial<IVideoFilter>): string {
    this.clear();
    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value);
    });
    return this.queryBuilder.toString();
  }
}
