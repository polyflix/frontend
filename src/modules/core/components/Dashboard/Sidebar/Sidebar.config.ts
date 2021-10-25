export enum SidebarSection {
  GENERAL = 'general',
  MANAGEMENT = 'management',
}

export interface SidebarItem {
  title: string
  icon: string
  badges?: number
  href?: string
  section?: SidebarSection
  items?: SidebarItem[]
  condition?: boolean
}

const sidebarConfig: SidebarItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: 'akar-icons:home',
  },
  {
    title: 'videos',
    href: '/videos',
    icon: 'eva:play-circle-outline',
    items: [
      {
        title: 'Create',
        icon: 'carbon:add',
        href: '/videos/create',
      },
    ],
  },
  {
    title: 'user',
    href: '/users/profile',
    icon: 'eva:people-fill',
  },
  {
    title: 'quizz',
    icon: 'eva:question-mark-circle-outline',
    items: [
      {
        title: 'List',
        href: '/quizzes',
        icon: 'eva:message-square-outline',
      },
    ],
  },
  {
    title: 'subtitle',
    href: '/login',
    icon: 'eva:message-square-outline',
  },
  {
    title: 'login',
    href: '/register',
    icon: 'eva:log-in-fill',
  },
  {
    title: 'Videos',
    href: '#',
    section: SidebarSection.MANAGEMENT,
    icon: 'majesticons:collection-line',
    items: [],
  },
  {
    title: 'Users',
    href: '#',
    section: SidebarSection.MANAGEMENT,
    icon: 'eva:people-fill',
    items: [],
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

  sidebarConfig.forEach((item) => {
    const section: string = item.section || SidebarSection.GENERAL
    const list: SidebarItem[] = config[section] || []
    config[section] = [...list, item]
  })

  return config
}
