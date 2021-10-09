import { resolve } from 'path'
import { PluginOption } from 'vite'

/**
 * This file contains a simple Vitejs plugin which can be used to replace content of files before the build.
 * This allow us to change configuration based on the build environment variable.
 */

interface Replacement {
  file: string
  replaceWith: string
}

export default function replaceFiles(
  replacements?: Replacement[]
): PluginOption {
  if (!replacements?.length) return null

  return {
    name: 'vite-replace-plugin',
    enforce: 'pre',
    async resolveId(source: any, importer: any) {
      const resolved = await this.resolve(source, importer, { skipSelf: true })

      const toReplace = replacements
        .map(({ file, replaceWith }) => ({
          base: file,
          dest: replaceWith,
          replaceWith: `${resolve(__dirname, '..')}/${replaceWith}`,
          file: `${resolve(__dirname, '..')}/${file}`,
        }))
        .find(({ file }) => file === resolved.id)

      if (!toReplace) return null

      console.info(
        `[INFO] Replacing content of "${toReplace.base}" with the content of "${toReplace.dest}"`
      )

      try {
        return {
          id: toReplace.replaceWith,
        }
      } catch (err) {
        console.error(err)
        return null
      }
    },
  }
}
