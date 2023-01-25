export const polyfilxRouter = () => ({
  home: '/',
  login: '/login',
  video: {
    watch: (id: string) => `/videos/${id}`,
  },
  studio: {
    home: '/studio',
    videos: {
      list: '/studio/videos',
      create: '/studio/videos/create',
      view: (id: string) => `/studio/videos/view/${id}`,
      update: (id: string) => `/studio/videos/${id}/update`,
    },
    quizzes: {
      list: '/studio/quizzes',
      create: '/studio/quizzes/create',
      view: (id: string) => `/studio/quizzes/view/${id}`,
      update: (id: string) => `/studio/quizzes/${id}/update`,
    },
    courses: {
      list: '/studio/courses',
      create: '/studio/courses/create',
      view: (id: string) => `/studio/courses/view/${id}`,
      update: (id: string) => `/studio/courses/${id}/update`,
    },
  },
})
