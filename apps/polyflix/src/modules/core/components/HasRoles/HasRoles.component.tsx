import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@types_/roles.type'
import { PropsWithChildren } from 'react'

type HasRolesProps = {
  roles: Role[]
}

export const HasRoles = ({
  children,
  roles,
}: PropsWithChildren<HasRolesProps>) => {
  const { hasRoles } = useRoles()

  if (!hasRoles(roles)) {
    return <></>
  }

  return <>{children}</>
}
