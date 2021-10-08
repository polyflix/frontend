import { useFetch } from '../../../common/hooks/useFetch.hook'
import { User } from '../../../users'
import { UserService } from '../../../users/services/user.service'

export const useUsers = (onStart?: () => any, onComplete?: () => any) => {
  return useFetch<User[], UserService>(UserService, 'getUsers', [], {
    onComplete,
    onStart,
  })
}
