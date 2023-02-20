import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

import replace from '.vite/replace.plugin'

/**
 * If we are on the development environment,
 */
const environmentReplacement =
  (process.env.BUILD_MODE || 'local') !== 'local'
    ? [
        {
          file: 'src/environments/environment.ts',
          replaceWith: `src/environments/${process.env.BUILD_MODE}.environment.ts`,
        },
      ]
    : []

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@mui\/icons-material\/(.*)/,
        replacement: '@mui/icons-material/esm/$1',
      },
      {
        find: '@theme',
        replacement: resolve(__dirname, './src/theme'),
      },
      {
        find: '@env',
        replacement: resolve(__dirname, './src/environments'),
      },
      {
        find: '@assets',
        replacement: resolve(__dirname, './src/assets'),
      },
      {
        find: '@constants',
        replacement: resolve(__dirname, './src/config/constants'),
      },
      {
        find: '@routes',
        replacement: resolve(__dirname, './src/config/routes'),
      },
      // Shared folder between app and studio
      {
        find: '@shared',
        replacement: resolve(__dirname, './src/shared'),
      },
      {
        find: '@components',
        replacement: resolve(__dirname, './src/shared/components'),
      },
      {
        find: '@services',
        replacement: resolve(__dirname, './src/shared/services'),
      },
      {
        find: '@layouts',
        replacement: resolve(__dirname, './src/shared/layouts'),
      },
      {
        find: '@types_',
        replacement: resolve(__dirname, './src/shared/types'),
      },
      // App specific folder
      {
        find: '@app',
        replacement: resolve(__dirname, './src/app'),
      },
      {
        find: '@app/pages',
        replacement: resolve(__dirname, './src/app/pages'),
      },
      {
        find: '@app/styles',
        replacement: resolve(__dirname, './src/app/styles'),
      },
      {
        find: '@app/contexts',
        replacement: resolve(__dirname, './src/app/contexts'),
      },
      // TODO: Remove this aliases
      {
        find: '@core',
        replacement: resolve(__dirname, './src/modules/core'),
      },
      {
        find: '@auth',
        replacement: resolve(__dirname, './src/modules/authentication'),
      },
      {
        find: '@videos',
        replacement: resolve(__dirname, './src/modules/videos'),
      },
      {
        find: '@collections',
        replacement: resolve(__dirname, './src/modules/collections'),
      },
      {
        find: '@users',
        replacement: resolve(__dirname, './src/modules/users'),
      },
      {
        find: '@quizzes',
        replacement: resolve(__dirname, './src/modules/quizzes'),
      },
      {
        find: '@subtitles',
        replacement: resolve(__dirname, './src/modules/subtitles'),
      },
      {
        find: '@stats',
        replacement: resolve(__dirname, './src/modules/stats'),
      },
      {
        find: '@courses',
        replacement: resolve(__dirname, './src/modules/courses'),
      },
      {
        find: '@links',
        replacement: resolve(__dirname, './src/modules/links'),
      },
      {
        find: '@attachments',
        replacement: resolve(__dirname, './src/modules/attachments'),
      },
      {
        find: '@search',
        replacement: resolve(__dirname, './src/modules/search'),
      },
      {
        find: '@admin',
        replacement: resolve(__dirname, './src/modules/admin'),
      },
      {
        find: '@certifications',
        replacement: resolve(__dirname, './src/modules/certifications'),
      },
      {
        find: '@studio',
        replacement: resolve(__dirname, './src/modules/studio'),
      },
    ],
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-transform-typescript-metadata',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    }),
    // eslintPlugin(),
    replace(environmentReplacement),
  ],
})
