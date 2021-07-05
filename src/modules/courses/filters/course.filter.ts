import { Injectable } from "@polyflix/di";
import { AbstractFilter } from "../../common/filters/abtract.filter";
import { PaginationFilter } from "../../common/types/filter.type";

export interface ICourseFilter extends PaginationFilter {
  order?: string;
  slug?: string;
  title?: string;
}

@Injectable()
export class CourseFilter extends AbstractFilter<ICourseFilter> {
  public buildFilters(filters: ICourseFilter | Partial<ICourseFilter>): string {
    this.clear();
    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value);
    });
    return this.queryBuilder.toString();
  }
}
