import { Injectable } from "@polyflix/di";
import { AbstractFilter } from "../../common/filters/abtract.filter";
import { PaginationFilter } from "../../common/types/filter.type";

export interface ICollectionFilter extends PaginationFilter {
  order?: string;
  slug?: string;
  title?: string;
  pulblisherId?: string;
}

@Injectable()
export class CollectionFilter extends AbstractFilter<ICollectionFilter> {
  public buildFilters(
    filters: ICollectionFilter | Partial<ICollectionFilter>
  ): string {
    this.clear();
    Object.entries(filters).forEach(([key, value]) => {
      this.queryBuilder.set(key, value);
    });
    return this.queryBuilder.toString();
  }
}
