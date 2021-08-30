import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgr from 'vite-plugin-svgr'
import tsPlugin from 'vite-plugin-ts'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    reactRefresh(),
    svgr(),
    eslintPlugin(),
    tsPlugin({
      babelPlugins: [
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    }),
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
