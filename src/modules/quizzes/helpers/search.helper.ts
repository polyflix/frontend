/**
 * Helper to build the search query to search quizzes by nname or author;
 * @see https://github.com/nestjsx/crud/wiki/Requests#search
 */
export const buildQuizzSearch = (value: string) => [
  {
    name: {
      $contL: value,
    },
  },
  {
    'user.firstName': {
      $contL: value,
    },
  },
  {
    'user.lastName': {
      $contL: value,
    },
  },
]
