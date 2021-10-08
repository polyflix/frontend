import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import tsPlugin from 'vite-plugin-ts'

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
  build: {
    outDir: 'dist',
  },
})
