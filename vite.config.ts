import react from '@vitejs/plugin-react'
import { find } from 'lodash'
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
        find: '@users',
        replacement: resolve(__dirname, './src/modules/users'),
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
