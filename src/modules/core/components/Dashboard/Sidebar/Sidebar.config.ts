import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@core/types/roles.type'

import i18n from '../../../../../i18n/config'

export enum SidebarSection {
  GENERAL = 'general',
  MANAGEMENT = 'management',
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
    roles: [Role.Student, Role.Teacher, Role.Admin],
  },
  {
    title: 'items.videos',
    href: '/videos/explore',
    icon: 'eva:play-circle-outline',
    roles: [Role.Student, Role.Teacher, Role.Admin],
  },
  {
    title: 'items.quizzes',
    href: '/quizzes/explore',
    icon: 'healthicons:i-exam-multiple-choice',
    roles: [Role.Student, Role.Teacher, Role.Admin],
  },
  {
    title: 'items.collections',
    href: '/collections/explore',
    icon: 'bx:bx-collection',
    roles: [Role.Student, Role.Teacher, Role.Admin],
  },
  {
    title: 'items.videos',
    section: SidebarSection.MANAGEMENT,
    icon: 'eva:play-circle-outline',
    roles: [Role.Teacher, Role.Admin],
    items: [
      {
        title: 'actions.list',
        href: '/users/profile/videos',
      },
      {
        title: 'actions.create',
        href: '/videos/create',
      },
    ],
  },
  {
    title: 'items.quizzes',
    section: SidebarSection.MANAGEMENT,
    icon: 'healthicons:i-exam-multiple-choice',
    roles: [Role.Teacher, Role.Admin],
    items: [
      {
        title: 'actions.list',
        href: '/users/profile/quizzes',
      },
      {
        title: 'actions.create',
        href: '/quizzes/create',
      },
      {
        title: 'actions.history',
        href: '/quizzes/history',
      },
    ],
  },
  {
    title: 'items.links',
    section: SidebarSection.MANAGEMENT,
    icon: 'eva:link-outline',
    items: [
      {
        title: 'actions.create',
        href: '/links/create',
      },
    ],
  },
  {
    title: 'items.collections',
    section: SidebarSection.MANAGEMENT,
    icon: 'bx:bx-collection',
    roles: [Role.Teacher, Role.Admin],
    items: [
      {
        title: 'actions.list',
        href: '/users/profile/collections',
      },
      {
        title: 'actions.create',
        href: '/collections/create',
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
