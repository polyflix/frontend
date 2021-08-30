export type GenericAction<T> = {
  type: string
  payload?: T | Partial<T>
}
