import { ListItem } from '@mui/material'
import MDEditor from '@uiw/react-md-editor'
import { useCallback, useContext, useEffect, useState } from 'react'

import { useInjection } from '@polyflix/di'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { useInterval } from '@core/hooks/useInterval.hook'
import { SnackbarService } from '@core/services/snackbar.service'

import {
  useGetNoteQuery,
  useUpdateNoteMutation,
} from '@videos/services/notes.service'

import { ColorModeContext } from '@theme/theme'

type NotesProps = {
  videoId: string
}
export const NotesPanel = ({ videoId }: NotesProps) => {
  const [value, setValue] = useState<string>()

  const [unsavedChange, setUnsavedChange] = useState(false)
  let { data, refetch } = useGetNoteQuery(videoId, {
    refetchOnMountOrArgChange: true,
  })
  const [updateNote] = useUpdateNoteMutation()
  const { mode } = useContext(ColorModeContext)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('videos')

  useEffect(() => {
    const { content: noteContent } = data || {}
    setValue(noteContent || '')
  }, [data])

  //manage lightmode/darkmode for md component
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', mode)
  }, [mode])

  const handleChange = (v: string) => {
    setValue(v)
    setUnsavedChange(true)
  }

  const saveChange: () => any = useCallback(() => {
    updateNote({
      slug: videoId,
      body: {
        content: value ?? '',
      },
    })
    setUnsavedChange(false)
    refetch()
  }, [value])

  useInterval(() => {
    if (unsavedChange) {
      saveChange()
    }
  }, 5000)

  const keyboardListener = useCallback(
    (e: KeyboardEvent) => {
      if (
        (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
        e.key === 's'
      ) {
        e.preventDefault()
        saveChange()
        snackbarService.createSnackbar(t('slug.sidebar.tabs.notes.saved'), {
          variant: 'success',
        })
      }
      if (e.key === ' ') {
        setValue(value + ' ')
      }
    },
    [unsavedChange, saveChange]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyboardListener)
    return () => {
      document.removeEventListener('keydown', keyboardListener)
    }
  }, [keyboardListener])

  return (
    <AutoScrollBox>
      {value !== undefined && (
        <ListItem>
          <MDEditor
            id="note"
            value={value}
            spellCheck={false}
            height={300}
            minHeight={400}
            onChange={(v) => handleChange(v!)}
            toolbarHeight={60}
          />
        </ListItem>
      )}
    </AutoScrollBox>
  )
}
