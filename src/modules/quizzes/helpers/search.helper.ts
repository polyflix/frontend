/**
 * Helper to build the search query to search quizzes by nname or author;
 * @see https://github.com/nestjsx/crud/wiki/Requests#search
 */
export const buildQuizzSearch = (value: string) => [
  {
    'element.name': {
      $contL: value,
    },
  },
  {
    'element.user.firstName': {
      $contL: value,
    },
  },
  {
    'element.user.lastName': {
      $contL: value,
    },
  },
]
