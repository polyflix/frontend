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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { ease } from '@core/utils/transition'

import { Video } from '@videos/models/video.model'

import { TabPanelStyle, RootStyle } from './PlayerSidebar.style'
import { SubtitlePanel } from './SubtitlesPanel/SubtitlesPanel.component'

type PlayerSidebarProps = {
  video: Video | undefined
  playerRef: React.RefObject<HTMLVmPlayerElement>
}

export const PlayerSidebar = ({ video, playerRef }: PlayerSidebarProps) => {
  const [value, setValue] = useState('1')

  const [open, setOpen] = useState(true)

  const { t } = useTranslation('videos')

  const th = useTheme()
  const ltlg: boolean = useMediaQuery(th.breakpoints.down('lg'))

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
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
              top: 5,
              right: 5,
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
                scrollButtons
                aria-label="video sidebar tabs"
              >
                <Tab label={t('slug.sidebar.tabs.subtitles.title')} value="1" />
                <Tab
                  label={t('slug.sidebar.tabs.notes.title')}
                  value="2"
                  disabled
                />
              </Tabs>
            </Box>
            <TabPanelStyle value="1">
              {video && <SubtitlePanel video={video} playerRef={playerRef} />}
            </TabPanelStyle>
            <TabPanelStyle value="2">
              <AutoScrollBox></AutoScrollBox>
            </TabPanelStyle>
          </TabContext>
        </Paper>
      </RootStyle>
    </Box>
  )
}
