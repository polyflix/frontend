export interface SideBarItem {
  title: string
  badges?: number
  href: string
  icon: string
  hasSomeRights?: any
}

export interface SideBarItemList {
  icon: string
  items: SideBarItem[]
  title: string
}

export type SideBarItems = (SideBarItem | SideBarItemList)[]

const sidebarConfig: SideBarItems = [
  {
    title: 'dashboard',
    href: '/',
    icon: 'eva:pie-chart-2-fill',
  },
  {
    title: 'user',
    href: '/profile',
    icon: 'eva:people-fill',
  },
  {
    title: 'video',
    href: '/dashboard/videos',
    icon: 'eva:play-circle-outline',
  },
  {
    title: 'quizz',
    icon: 'eva:question-mark-circle-outline',
    items: [
      {
        title: 'subtitle',
        href: '/a',
        icon: 'eva:message-square-outline',
      },
      {
        title: 'login',
        href: '/b',
        icon: 'eva:log-in-fill',
      },
      {
        title: 'login',
        href: '/c',
        icon: 'eva:log-in-fill',
      },
      {
        title: 'login',
        href: '/d',
        icon: 'eva:log-in-fill',
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
]

export default sidebarConfig
