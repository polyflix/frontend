import { Role } from '@types_/roles.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

type UseRolesReturn = {
  hasRoles: (roles: Role[]) => boolean
}

export const useRoles = (): UseRolesReturn => {
  const { user } = useAuth()

  const hasRoles = (roles: Role[]): boolean =>
    (user?.roles || [])?.some((role: Role) => roles?.includes(role))

  return {
    hasRoles,
  }
}
