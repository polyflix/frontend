import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

import replace from './.vite/replace.plugin'

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
        find: '@search',
        replacement: resolve(__dirname, './src/modules/search'),
      },
      {
        find: '@admin',
        replacement: resolve(__dirname, './src/modules/admin'),
      },
      {
        find: '@roles',
        replacement: resolve(__dirname, './src/modules/roles'),
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
