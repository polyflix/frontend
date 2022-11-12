import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@core/types/roles.type'

import i18n from '../../../../../i18n/config'

export enum SidebarSection {
  GENERAL = 'general',
  MANAGEMENT = 'management',
  ADMIN = 'administration',
}

export interface SidebarItem {
  title: string
  icon?: string
  badges?: number
  href?: string
  section?: SidebarSection
  items?: SidebarItem[]
  roles?: Role[]
  disabled?: boolean
}

const sidebarConfiguration: SidebarItem[] = [
  {
    title: 'items.home',
    href: '/',
    icon: 'akar-icons:home',
    roles: [Role.Member, Role.Contributor, Role.Admin],
  },
  {
    title: 'items.videos',
    icon: 'eva:play-circle-outline',
    href: '/videos/explore',
    roles: [Role.Member, Role.Contributor, Role.Admin],
  },
  {
    title: 'items.quizzes',
    icon: 'healthicons:i-exam-multiple-choice',
    href: '/quizzes/explore',
    roles: [Role.Member, Role.Contributor, Role.Admin],
  },
  {
    title: 'items.collections',
    href: '/modules/explore',
    icon: 'bx:bx-collection',
    roles: [Role.Member, Role.Contributor, Role.Admin],
  },
  {
    title: 'items.courses',
    href: '/courses/explore',
    icon: 'gg:align-left',
    roles: [Role.Member, Role.Contributor, Role.Admin],
  },
  {
    title: 'administration.resources.users',
    section: SidebarSection.ADMIN,
    icon: 'bxs:user',
    href: '/admin/users',
    roles: [Role.Admin],
  },
  {
    title: 'administration.resources.groups',
    section: SidebarSection.ADMIN,
    icon: 'carbon:user-multiple',
    href: '/admin/groups',
    roles: [Role.Admin],
  },
  {
    title: 'administration.resources.certifications',
    section: SidebarSection.ADMIN,
    icon: 'carbon:user-certification',
    href: '/admin/certifications',
    roles: [Role.Admin],
  },
  {
    title: 'administration.resources.videos',
    section: SidebarSection.ADMIN,
    icon: 'eva:play-circle-outline',
    roles: [Role.Admin],
    items: [
      {
        title: 'administration.resources.videos',
        href: '/admin/videos',
      },
      {
        title: 'administration.resources.reports',
        href: '/admin/reports',
      },
    ],
  },
]

export interface SidebarConfiguration {
  [section: string]: SidebarItem[]
}

/**
 * Map the sidebar configuration with the section as key and the list of items present in this last.
 */
export const getSidebarSections = (): SidebarConfiguration => {
  const config: SidebarConfiguration = {}
  const { hasRoles } = useRoles()

  sidebarConfiguration.forEach((item) => {
    if (item?.roles?.length && !hasRoles(item?.roles || [])) return
    const section: string = i18n.t(
      `sidebar:sections.${item.section || SidebarSection.GENERAL}`
    )
    const list: SidebarItem[] = config[section] || []
    config[section] = [...list, item]
  })

  return config
}
