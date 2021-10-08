import { OrderEnum } from '../types/OrderEnum'

export const buildQueryOrdering = (field: string, order: OrderEnum) =>
  order === OrderEnum.DESC ? `-${field}` : field
