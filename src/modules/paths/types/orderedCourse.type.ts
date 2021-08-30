import { ICourse } from '../../courses/types'

export interface IOrderedCourse {
  id: string
  order: number
  course: ICourse
}
