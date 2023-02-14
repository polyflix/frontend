/**
 * By https://github.com/HexMox/milkdown-plugin-placeholder
 */

import type { MilkdownPlugin, Timer } from '@milkdown/ctx'
import { Decoration, DecorationSet, EditorView } from '@milkdown/prose/view'
import { createSlice, createTimer } from '@milkdown/ctx'
import { InitReady, prosePluginsCtx } from '@milkdown/core'
import { Plugin, PluginKey } from '@milkdown/prose/state'

const DEFAULT_PLACEHOLDER = 'Please input here...'
export const placeholderCtx = createSlice(DEFAULT_PLACEHOLDER, 'placeholder')
export const placeholderTimerCtx = createSlice(
  [] as Timer[],
  'editorStateTimer'
)

export const PlaceholderReady = createTimer('PlaceholderReady')

const key = new PluginKey('MILKDOWN_PLACEHOLDER')

export const placeholder: MilkdownPlugin = (pre) => {
  pre
    .inject(placeholderCtx)
    .inject(placeholderTimerCtx, [InitReady])
    .record(PlaceholderReady)

  return async (ctx) => {
    await ctx.waitTimers(placeholderTimerCtx)

    const prosePlugins = ctx.get(prosePluginsCtx)

    const update = (view: EditorView) => {
      const placeholderText = ctx.get(placeholderCtx)
      const doc = view.state.doc
      if (
        view.editable &&
        doc.childCount === 1 &&
        doc.firstChild?.isTextblock &&
        doc.firstChild?.content.size === 0
      ) {
        view.dom.setAttribute('data-placeholder', placeholderText)
      } else {
        view.dom.removeAttribute('data-placeholder')
      }
    }

    const plugins = [
      ...prosePlugins,
      new Plugin({
        key,
        props: {
          decorations(state) {
            const placeholderText = ctx.get(placeholderCtx)
            const doc = state.doc

            if (
              doc.childCount === 1 &&
              doc.firstChild?.isTextblock &&
              doc.firstChild?.content.size === 0 &&
              doc.firstChild?.type.name === 'paragraph'
            ) {
              return DecorationSet.create(doc, [
                Decoration.widget(
                  1,
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  (view: EditorView, getPos: () => number | undefined) => {
                    const span = document.createElement('span')
                    span.style.opacity = '0.5'
                    span.innerHTML = placeholderText
                    return span
                  }
                ),
              ])
            }
          },
        },
        view(view) {
          update(view)

          return { update }
        },
      }),
    ]

    ctx.set(prosePluginsCtx, plugins)

    ctx.done(PlaceholderReady)
  }
}
