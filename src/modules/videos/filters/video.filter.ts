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
  exact?: boolean;
  tags?: string;
}

@Injectable()
export class VideoFilter extends AbstractFilter<IVideoFilter> {
  public buildFilters(filters: IVideoFilter | Partial<IVideoFilter>): string {
    this.clear();
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "tags") this.queryBuilder.set(key, value);
    });
    let qb = this.queryBuilder.toString();
    if (filters.tags) {
      if (qb[qb.length - 1] === "?") qb.substring(0, qb.length);
      for (const tag of filters.tags.split("&")) {
        qb += `&tags[]=${tag}`;
      }
    }
    return qb;
  }
}
