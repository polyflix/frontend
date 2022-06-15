import {
  Box,
  Button,
  Container,
  Fade,
  Modal,
  Paper,
  Stack,
  Theme,
  Typography,
} from '@mui/material'
import { alpha, SxProps } from '@mui/system'
import { useState } from 'react'
import { UseFieldArrayReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Icon } from '@core/components/Icon/Icon.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import { ElementType } from '@core/types/element.type'
import { ease } from '@core/utils/transition'

import { ICollectionForm } from '@collections/types/form.type'

import { ElementContainerStyle } from './ElementModal.style'
import { QuizzList } from './QuizzList/QuizzList.component'
import { VideoList } from './VideoList/VideoList.component'

interface IElementItem {
  icon: string
  label: string
  description: string
  value: ElementType
}

type ElementModalProps = {
  sx?: SxProps<Theme>
  open: boolean
  onClose: () => void
  fieldArray: UseFieldArrayReturn<ICollectionForm, 'elements', 'id'>
}

export const ElementModal = ({
  sx: sxProps,
  open,
  onClose,
  fieldArray,
}: ElementModalProps) => {
  const [selectedElementPage, setSelectedElementPage] =
    useState<ElementType>('video')

  const { t } = useTranslation('collections')

  const items: IElementItem[] = [
    {
      icon: 'si-glyph:global',
      label: t('forms.elementModal.elementType.types.video.label'),
      description: t('forms.elementModal.elementType.types.video.description'),
      value: 'video',
    },
    {
      icon: 'ri:lock-password-line',
      label: t('forms.elementModal.elementType.types.quizz.label'),
      description: t('forms.elementModal.elementType.types.quizz.description'),
      value: 'quizz',
    },
    // attachment temporary disabled has it is not implemented yet
    // {
    //   icon: 'ic:outline-visibility-off',
    //   label: t('forms.elementModal.elementType.types.link.label'),
    //   description: t('forms.elementModal.elementType.types.link.description'),
    //   value: 'link',
    // },
  ]

  const displayContent = () => {
    switch (selectedElementPage) {
      // case 'link':
      //   return <LinkList fieldArray={fieldArray} />
      case 'quizz':
        return <QuizzList fieldArray={fieldArray} />
      case 'video':
        return <VideoList fieldArray={fieldArray} />
    }
  }

  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        ...sxProps,
      }}
      keepMounted={false}
      open={open}
      onClose={() => onClose()}
      aria-labelledby="element modal"
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: {
              sm: '80%',
              xs: '100%',
            },
            bgcolor: 'background.default',
            borderRadius: 2,
            p: {
              sm: 2,
              xs: 1,
            },
          }}
          variant="outlined"
        >
          <Scrollbar
            sx={{
              maxHeight: (theme) => `calc(100vh - ${theme.spacing(10)})`,
              minHeight: '300px',
            }}
          >
            <ElementContainerStyle>
              {items.map(({ value: v, label, description, icon }, idx) => {
                const isActive = v === selectedElementPage
                return (
                  <Box key={idx}>
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        cursor: 'pointer',
                        transition: (theme) => ease(theme, 'background'),
                        ...(isActive && {
                          background: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                        }),
                      }}
                      variant="outlined"
                      onClick={() => setSelectedElementPage(v)}
                    >
                      <Stack direction="row">
                        <Box sx={{ flexShrink: 1, mr: 2 }}>
                          <Icon name={icon} size={30} />
                        </Box>
                        <Stack>
                          <Typography variant="h5">{label}</Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 2, color: 'text.secondary' }}
                          >
                            {description}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>
                )
              })}
            </ElementContainerStyle>
            <Box sx={{ mt: 2 }}>{displayContent()}</Box>
          </Scrollbar>
          <Container
            sx={{ display: 'flex', justifyContent: 'center', my: '1em' }}
          >
            <Button onClick={onClose} variant="contained">
              {t('forms.create-update.actions.validate')}
            </Button>
          </Container>
        </Paper>
      </Fade>
    </Modal>
  )
}
