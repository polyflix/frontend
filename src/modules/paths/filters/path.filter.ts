import { Injectable } from "@polyflix/di";
import { AbstractFilter } from "../../common/filters/abtract.filter";
import { PaginationFilter } from "../../common/types/filter.type";

export interface IPathFilter extends PaginationFilter {
  order?: string;
  slug?: string;
  title?: string;
}

@Injectable()
export class PathFilter extends AbstractFilter<IPathFilter> {
  public buildFilters(filters: IPathFilter | Partial<IPathFilter>): string {
    this.clear();
    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value);
    });
    return this.queryBuilder.toString();
  }
}
