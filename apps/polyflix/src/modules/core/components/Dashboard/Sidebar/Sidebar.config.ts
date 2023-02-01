import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@core/types/roles.type'

import i18n from '../../../../../i18n/config'

export enum SidebarSection {
  GENERAL = 'general',
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
  // {
  //   title: 'items.home',
  //   href: '/',
  //   icon: 'akar-icons:home',
  //   roles: [Role.Member, Role.Contributor, Role.Admin],
  // },
  // {
  //   title: 'items.videos',
  //   icon: 'eva:play-circle-outline',
  //   href: '/videos/explore',
  //   roles: [Role.Member, Role.Contributor, Role.Admin],
  // },
  // {
  //   title: 'items.quizzes',
  //   icon: 'healthicons:i-exam-multiple-choice',
  //   href: '/quizzes/explore',
  //   roles: [Role.Member, Role.Contributor, Role.Admin],
  // },
  // {
  //   title: 'items.collections',
  //   href: '/modules/explore',
  //   icon: 'bx:bx-collection',
  //   roles: [Role.Member, Role.Contributor, Role.Admin],
  // },
  // {
  //   title: 'items.courses',
  //   href: '/courses/explore',
  //   icon: 'gg:align-left',
  //   roles: [Role.Member, Role.Contributor, Role.Admin],
  // },
  // {
  //   title: 'administration.resources.groups',
  //   section: SidebarSection.MANAGEMENT,
  //   icon: 'carbon:user-multiple',
  //   href: '/admin/groups',
  //   roles: [Role.Contributor, Role.Admin],
  // },
  {
    title: 'items.videos',
    section: SidebarSection.GENERAL,
    icon: 'eva:play-circle-outline',
    href: '/studio/videos',
    roles: [Role.Contributor, Role.Admin],
  },
  {
    title: 'items.quizzes',
    section: SidebarSection.GENERAL,
    icon: 'healthicons:i-exam-multiple-choice',
    href: '/studio/quizzes',
    roles: [Role.Contributor, Role.Admin],
  },
  {
    title: 'items.courses',
    section: SidebarSection.GENERAL,
    href: '/studio/courses',
    icon: 'gg:align-left',
    roles: [Role.Contributor, Role.Admin],
  },
  // {
  //   title: 'administration.resources.certifications',
  //   section: SidebarSection.MANAGEMENT,
  //   icon: 'carbon:user-certification',
  //   href: '/admin/certifications',
  //   roles: [Role.Contributor, Role.Admin],
  // },
  // {
  //   title: 'administration.resources.videos',
  //   section: SidebarSection.MANAGEMENT,
  //   icon: 'eva:play-circle-outline',
  //   roles: [Role.Contributor, Role.Admin],
  //   items: [
  //     {
  //       title: 'administration.resources.videos',
  //       href: '/admin/videos',
  //     },
  //     {
  //       title: 'administration.resources.reports',
  //       href: '/admin/reports',
  //     },
  //   ],
  // },
  {
    title: 'administration.resources.users',
    section: SidebarSection.ADMIN,
    icon: 'bxs:user',
    href: '/studio/users',
    roles: [Role.Contributor, Role.Admin],
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
    const section: string = i18n.t(`sidebar:sections.${item.section}`)
    const list: SidebarItem[] = config[section] || []
    config[section] = [...list, item]
  })

  return config
}
