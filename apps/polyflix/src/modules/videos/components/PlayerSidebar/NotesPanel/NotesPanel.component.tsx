import { useCallback, useEffect, useState } from 'react'
import { Ctx, defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { getNord } from '@milkdown/theme-nord'
import { ReactEditor, useEditor } from '@milkdown/react'
import { commonmark } from '@milkdown/preset-commonmark'
import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { Alert, Box, Skeleton, styled } from '@mui/material'
import { history } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import {
  useGetNoteQuery,
  useUpdateNoteMutation,
} from '@videos/services/notes.service'
import { useInterval } from '@core/hooks/useInterval.hook'
import { placeholder, placeholderCtx } from './PlaceHolder.plugin'
import { gfm } from '@milkdown/preset-gfm'
import { useTranslation } from 'react-i18next'

const StyledEditor = styled('div')(({ theme }) => ({
  '& .milkdown': {
    minHeight: '400px',
  },
  '& .milkdown .editor': {
    padding: theme.spacing(1, 2),
    minHeight: '400px',
  },
  '& .milkdown .editor .heading': {
    margin: theme.spacing(1, 0),
  },
  '& .milkdown .editor .heading span.ProseMirror-widget': {
    color: theme.palette.primary.light,
  },
  '& .milkdown .editor .list-item .list-item_label': {
    color: theme.palette.primary.light,
  },
  '& .milkdown .editor > *': {
    margin: theme.spacing(1, 0),
  },
  '& .milkdown .code-fence_selector-wrapper': {
    display: 'none',
  },
  '& .milkdown .code-fence pre': {
    margin: 0,
  },
}))

type MarkdonwEditorProps = {
  handleChange: (
    ctx: Ctx,
    markdown: string,
    prevMarkdown: string | null
  ) => void
  defaultValue: string
}

const MarkdonwEditor = ({
  handleChange,
  defaultValue,
}: MarkdonwEditorProps) => {
  const { t } = useTranslation('common')
  const darkMode = false
  const { editor } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.get(listenerCtx).markdownUpdated(handleChange)
        ctx.set(defaultValueCtx, defaultValue)
        ctx.set(placeholderCtx, t('form.placeHolder.typeHere'))
      })
      .use(getNord(darkMode))
      .use(listener)
      .use(history)
      .use(commonmark)
      .use(placeholder)
      .use(gfm)
  )

  return (
    <StyledEditor>
      <ReactEditor editor={editor} />
    </StyledEditor>
  )
}

type NotesProps = {
  videoId: string
}
export const NotesPanel = ({ videoId }: NotesProps) => {
  const [unsavedChange, setUnsavedChange] = useState(false)
  const [updateNote] = useUpdateNoteMutation()
  let { data, isLoading, isError, isSuccess } = useGetNoteQuery(videoId)
  const { t } = useTranslation('videos')

  const noteContent = data?.content || ''

  const saveChange: () => any = useCallback(() => {
    updateNote({
      slug: videoId,
      body: {
        content: noteContent,
      },
    })
    setUnsavedChange(false)
  }, [noteContent])

  useInterval(() => {
    if (unsavedChange) {
      saveChange()
    }
  }, 3_000)

  useEffect(() => {
    return () => {
      if (unsavedChange) {
        saveChange()
      }
    }
  }, [])

  const handleChange = useCallback(
    (ctx: Ctx, markdown: string, prevMarkdown: string | null) => {
      if (
        markdown !== prevMarkdown &&
        markdown.trim() !== noteContent?.trim() &&
        !isLoading
      ) {
        setUnsavedChange(true)
      }
    },
    [noteContent, isLoading]
  )

  if (isError) {
    return (
      <Box
        sx={{
          p: 2,
          pt: 3,
        }}
      >
        <Alert severity="error">{t('error.title', { ns: 'common' })}</Alert>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 2,
          pt: 3,
        }}
      >
        <Skeleton animation="wave" width="70%" height={15} />
        <Skeleton animation="wave" width="60%" height={15} />
      </Box>
    )
  }

  return (
    <AutoScrollBox>
      {isSuccess && (
        <>
          <Box
            sx={{
              py: 0.5,
              px: 2,
              color: unsavedChange ? 'warning.main' : 'success.main',
              textAlign: 'end',
            }}
          >
            {t(
              `slug.sidebar.tabs.notes.${unsavedChange ? 'unsaved' : 'saved'}`
            )}
          </Box>
          <MarkdonwEditor
            handleChange={handleChange}
            defaultValue={noteContent}
          />
        </>
      )}
    </AutoScrollBox>
  )
}
