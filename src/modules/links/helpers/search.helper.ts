/**
 * Helper to build the search query to search quizzes by nname or author;
 * @see https://github.com/nestjsx/crud/wiki/Requests#search
 */
export const buildLinkSearch = (value: string) => [
  {
    'element.name': {
      $contL: value,
    },
  },
]
