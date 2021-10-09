import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

import replace from './.vite/replace.plugin'

/**
 * If we are on the development environment,
 */
const environmentReplacement =
  (process.env.NODE_ENV || 'local') !== 'local'
    ? [
        {
          file: 'src/environments/environment.ts',
          replaceWith: `src/environments/${process.env.NODE_ENV}.environment.ts`,
        },
      ]
    : []

export default defineConfig({
  resolve: {
    alias: {
      '@theme': resolve(__dirname, './src/theme'),
      '@env': resolve(__dirname, './src/environments'),
      '@core': resolve(__dirname, './src/modules/core'),
    },
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
    eslintPlugin(),
    replace(environmentReplacement),
  ],
})
