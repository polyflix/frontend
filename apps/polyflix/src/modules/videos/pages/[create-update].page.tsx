import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material'
import { isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { ErrorLayout } from '@core/layouts/Error/Error.layout'

import { VideoForm } from '@videos/components/Forms/VideoForm.component'
import { useGetVideoQuery } from '@videos/services/video.service'
import { PlayerVideoSource } from '@videos/types/video.type'

const steps = ['forms.stepper.steps.provider', 'forms.stepper.steps.info']

export const CreateUpdatePage = () => {
  const { slug } = useParams<{ slug: string }>()

  // We want to fetch the video only if the slug is defined, in case of update mode.
  const { data: video, isLoading } = useGetVideoQuery(slug, { skip: !slug })

  const isUpdate = !isUndefined(video)

  const { t } = useTranslation('videos')

  const [i18nKey, setI18nKey] = useState('default')
  const [source, setSource] = useState<string>()
  const [activeStep, setActiveStep] = useState(0)
  const [disableNextButton, setDisableNextButton] = useState(true)

  const getI18nKey = () => {
    if (activeStep === 0 || (!video && !source)) {
      return 'default'
    }
    if (!isUndefined(video)) {
      return 'update'
    }
    if (source) {
      return source.toLowerCase()
    }
    return 'create'
  }

  useEffect(() => {
    if (!!video) {
      setActiveStep(1)
      setSource(video.sourceType)
    }
  }, [video])

  useEffect(() => {
    setI18nKey(getI18nKey())
  }, [source, video, activeStep])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource((event.target as HTMLInputElement).value)
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const providerForm = () => (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={source}
        onChange={handleChange}
      >
        <Stack spacing={2}>
          <Stack>
            <FormControlLabel
              value={PlayerVideoSource.YOUTUBE}
              control={<Radio />}
              label="Youtube"
            />
            <Typography variant="body2">{t('providers.youtube')}</Typography>
          </Stack>
          <Stack>
            <FormControlLabel
              value={PlayerVideoSource.INTERNAL}
              control={<Radio />}
              label="Internal"
            />
            <Typography variant="body2">{t('providers.internal')}</Typography>
          </Stack>
        </Stack>
      </RadioGroup>
    </FormControl>
  )

  const videoForm = () => (
    <VideoForm
      i18nKey={i18nKey}
      isUpdate={isUpdate}
      video={video}
      source={source as PlayerVideoSource}
    />
  )

  const errorStep = () => <ErrorLayout code={404} />

  const displayStepperContent = () => {
    switch (activeStep) {
      case 0:
        return providerForm()
      case 1:
        return videoForm()
      default:
        return errorStep()
    }
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  useEffect(() => {
    if (!source) {
      setDisableNextButton(true)
    } else {
      setDisableNextButton(activeStep === steps.length - 1)
    }
  }, [source, activeStep])

  return (
    <Page
      isLoading={isLoading}
      title={t(`forms.create-update.title.${i18nKey}`, { video: video?.title })}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label: string, index: number) => {
          const stepProps: { completed?: boolean; active?: boolean } = {}
          const stepButtonProps: { disabled?: boolean } = {}
          if (index === 0 && !!source) {
            stepProps.completed = true
          }
          if (index === 1 && !!source) {
            stepButtonProps.disabled = false
            stepProps.active = true
          }

          return (
            <Step key={label} {...stepProps}>
              <StepButton
                color="inherit"
                onClick={handleStep(index)}
                {...stepButtonProps}
              >
                {t(label)}
              </StepButton>
            </Step>
          )
        })}
      </Stepper>
      <>
        <Box
          my={{
            sm: 2,
            md: 4,
          }}
        >
          <Header
            title={t(`forms.create-update.title.${i18nKey}`, {
              video: video?.title,
            })}
            description={t(`forms.create-update.description.${i18nKey}`)}
          />

          {displayStepperContent()}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', py: 4 }}>
          <Button
            color="inherit"
            variant="contained"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {t('forms.stepper.actions.back')}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={disableNextButton}
          >
            {t('forms.stepper.actions.next')}
          </Button>
        </Box>
      </>
    </Page>
  )
}
