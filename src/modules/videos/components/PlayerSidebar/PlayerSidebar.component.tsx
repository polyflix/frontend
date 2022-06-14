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

import {
  AttachmentStatus,
  AttachmentType,
} from '@attachments/models/attachment.model'
import { useGetVideoAttachmentsQuery } from '@attachments/services/attachment.service'

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

  // const [] = useGetVideoAttachmentsQuery('')

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
              {video && (
                <AttachmentsPanel
                  attachments={[
                    {
                      id: 'id',
                      title: 'Super attachment',
                      modules: [],
                      videos: [],
                      status: AttachmentStatus.Completed,
                      url: 'http://google.com',
                      description: 'vlavla',
                      type: AttachmentType.External,
                      userId: 'okok',
                    },
                    {
                      id: '27ac8095-dabe-4f6a-8da5-8a3a3b9f09c9',
                      userId: '92d7e6f2-bde5-48b3-a0c2-cf8ef391361a',
                      status: AttachmentStatus.Completed,
                      type: AttachmentType.Internal,
                      videos: [],
                      modules: [],
                      url: 'http://localhost:9000/attachments/27ac8095-dabe-4f6a-8da5-8a3a3b9f09c9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20220614%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220614T145646Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0e7d1e0aae373a1c23074a176d144207a79aaa58743ae11e3aa3cc9c4a26d527',
                      extension: 'png',
                      title: 'bg la coupe',
                    },
                    {
                      id: 'id',
                      title: 'Super attachment',
                      modules: [],
                      videos: [],
                      status: AttachmentStatus.Completed,
                      url: 'http://gitlab.com',
                      description: 'vlavla',
                      type: AttachmentType.External,
                      userId: 'okok',
                    },
                  ]}
                />
              )}
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
