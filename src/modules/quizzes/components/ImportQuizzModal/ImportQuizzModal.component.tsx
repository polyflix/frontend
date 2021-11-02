import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'
import { QuizzParser } from '@polyflix/quizz-parser'

import { Dropzone } from '@core/components/Dropzone/Dropzone.component'
import { Visibility } from '@core/models/content.model'
import { LocalFileService } from '@core/services/local-file.service'
import { SnackbarService } from '@core/services/snackbar.service'

import { Quizz } from '@quizzes/models/quizz.model'

interface Props {
  open: boolean
  onClose: () => void
  onImport: (quizz: Quizz) => void
}

// Component used in the quizz form to import a quizz from a file
export const ImportQuizzModal = ({ open, onClose, onImport }: Props) => {
  const localFileService = useInjection<LocalFileService>(LocalFileService)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('quizzes')

  // Store the current active tba
  const [tab, setTab] = useState(0)

  /**
   * Called when the user upload his file
   * @param file
   */
  const handleImport = async (file: File) => {
    const fileContent = await localFileService.readAsText(file)
    try {
      const parsedQuizz = QuizzParser.parse(fileContent)

      snackbarService.createSnackbar(t('import.success'), {
        variant: 'success',
      })

      onImport({
        ...parsedQuizz,
        allowedRetries: 1,
        draft: false,
        name: 'My super quizz',
        visibility: Visibility.PUBLIC,
        keepHighestScore: false,
      })
    } catch (e: any) {
      snackbarService.createSnackbar(e.message, { variant: 'error' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '50%' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 10,
            p: 4,
          }}
        >
          <Box sx={{ borderBottom: 1, mb: 2, borderColor: 'divider' }}>
            <Tabs onChange={(e, value) => setTab(value)} value={tab}>
              <Tab label="Import" />
              <Tab label="Help" />
            </Tabs>
          </Box>
          {tab === 0 ? (
            <Stack spacing={2}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('import.subtitle')}
              </Typography>
              <Dropzone
                hint
                accept=".txt"
                onAcceptedFiles={([file]) => handleImport(file)}
              />
            </Stack>
          ) : (
            <Stack>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('import.example.description')}
                <ul className="px-8 my-4">
                  {['delimiter', 'alternatives', 'answers'].map(
                    (rule, index) => (
                      <li key={index}>{t(`import.example.rules.${rule}`)}</li>
                    )
                  )}
                </ul>
              </Typography>
              <Box
                sx={{
                  backgroundColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                }}
                component="pre"
              >
                <Typography variant="body1">
                  What is Rust ?
                  <br />
                  A. A low-level programming language
                  <br />
                  B. A high-level programming language
                  <br />
                  Answer: A
                  <br />
                  ---
                  <br />
                  When will Javascript be useful?
                  <br />
                  A. Mobile apps development
                  <br />
                  B. Embedded apps development
                  <br />
                  C. Desktop apps development
                  <br />
                  D. Web apps development
                  <br />
                  Answer: A,D
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>
      </Fade>
    </Modal>
  )
}
