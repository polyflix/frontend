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
  condition?: boolean
}

const sidebarConfiguration: SidebarItem[] = [
  {
    title: 'items.home',
    href: '/',
    icon: 'akar-icons:home',
  },
  {
    title: 'items.videos',
    href: '/videos',
    icon: 'eva:play-circle-outline',
    items: [
      {
        title: 'actions.create',
        icon: 'carbon:add',
        href: '/videos/create',
      },
    ],
  },
  {
    title: 'items.quizzes',
    href: '/quizzes/explore',
    icon: 'healthicons:i-exam-multiple-choice',
  },
  {
    title: 'items.quizzes',
    section: SidebarSection.MANAGEMENT,
    icon: 'healthicons:i-exam-multiple-choice',
    items: [
      {
        title: 'actions.list',
        href: '/users/profile?tab=quizzes',
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
]

export interface SidebarConfiguration {
  [section: string]: SidebarItem[]
}

/**
 * Map the sidebar configuration with the section as key and the list of items present in this last.
 */
export const getSidebarSections = (): SidebarConfiguration => {
  const config: SidebarConfiguration = {}

  sidebarConfiguration.forEach((item) => {
    const section: string = i18n.t(
      `sidebar:sections.${item.section || SidebarSection.GENERAL}`
    )
    const list: SidebarItem[] = config[section] || []
    config[section] = [...list, item]
  })

  return config
}
