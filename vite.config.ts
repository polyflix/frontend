import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
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
    svgr(),
    eslintPlugin(),
  ],
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  build: {
    outDir: 'dist',
  },
})
