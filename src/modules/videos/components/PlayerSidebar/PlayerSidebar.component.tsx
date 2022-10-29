import { ChevronRight } from '@mui/icons-material'
import { TabContext } from '@mui/lab'
import {
  Box,
  Paper,
  Tab,
  Tabs,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { useQuery } from '@core/hooks/useQuery'
import { ease } from '@core/utils/transition'

import { NotesPanel } from '@videos/components/PlayerSidebar/NotesPanel/NotesPanel.component'
import { Video } from '@videos/models/video.model'

import { AttachmentsPanel } from './AttachmentsPanel/AttachmentsPanel.component'
import { CollectionPanel } from './CollectionPanel/CollectionPanel.component'
import { TabPanelStyle, RootStyle } from './PlayerSidebar.style'
import { SubtitlePanel } from './SubtitlesPanel/SubtitlesPanel.component'

enum TabIndex {
  SUBTITLES = '1',
  MODULE = '2',
  ATTACHEMENT = '3',
  NOTES = '4',
}

type PlayerSidebarProps = {
  video: Video | undefined
  playerRef: React.RefObject<HTMLVmPlayerElement>
}

export const PlayerSidebar = ({ video, playerRef }: PlayerSidebarProps) => {
  const query = useQuery() as URLSearchParams

  const [value, setValue] = useState(TabIndex.SUBTITLES)

  const [open, setOpen] = useState(true)

  const { t } = useTranslation('videos')

  const th = useTheme()
  const ltlg: boolean = useMediaQuery(th.breakpoints.down('lg'))

  useEffect(() => {
    if (query.get('c')) {
      setValue(TabIndex.MODULE)
    }
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: TabIndex) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      {!ltlg && (
        <Tooltip
          title={t<string>(
            `slug.sidebar.tooltips.${open ? 'collapse' : 'expand'}`
          )}
        >
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <ChevronRight
              sx={{
                transition: (theme) => ease(theme, 'transform'),
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            />
          </IconButton>
        </Tooltip>
      )}
      <RootStyle open={ltlg || open}>
        <Paper
          sx={{
            height: '100%',
            width: '100%',
          }}
          variant="outlined"
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                aria-label="video sidebar tabs"
              >
                <Tab
                  label={t('slug.sidebar.tabs.subtitles.title')}
                  value={TabIndex.SUBTITLES}
                />
                {query.has('c') && (
                  <Tab
                    label={t('slug.sidebar.tabs.collections.title')}
                    value={TabIndex.MODULE}
                  />
                )}
                <Tab
                  label={t('slug.sidebar.tabs.attachments.title')}
                  value={TabIndex.ATTACHEMENT}
                />
                <Tab
                  label={t('slug.sidebar.tabs.notes.title')}
                  value={TabIndex.NOTES}
                />
              </Tabs>
            </Box>
            <TabPanelStyle value={TabIndex.SUBTITLES}>
              {video && <SubtitlePanel video={video} playerRef={playerRef} />}
            </TabPanelStyle>
            <TabPanelStyle value={TabIndex.ATTACHEMENT}>
              {video && <AttachmentsPanel video={video} />}
            </TabPanelStyle>
            <TabPanelStyle value={TabIndex.MODULE}>
              {query.has('c') && <CollectionPanel />}
            </TabPanelStyle>
            <TabPanelStyle value={TabIndex.NOTES}>
              {video && <NotesPanel videoId={video.slug} />}
              <AutoScrollBox />
            </TabPanelStyle>
          </TabContext>
        </Paper>
      </RootStyle>
    </Box>
  )
}
