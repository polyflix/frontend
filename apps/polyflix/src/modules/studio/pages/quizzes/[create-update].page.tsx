import { Box, Button, Divider } from '@mui/material'
import { isUndefined } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { Element } from '@core/models/element.model'

import { QuizzForm } from '@quizzes/components/Forms/QuizzForm.component'
import { ImportQuizzModal } from '@quizzes/components/ImportQuizzModal/ImportQuizzModal.component'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzQuery } from '@quizzes/services/quizz.service'

export const CreateUpdateQuizzPage = () => {
  const { t } = useTranslation('quizzes')
  const { id } = useParams<{ id: string }>()

  const [isImport, setIsImport] = useState<boolean>(false)
  const [importedQuizz, setImportedQuizz] = useState<Element<Quizz>>()

  const { data, isLoading } = useGetQuizzQuery(
    { id, filters: { solved: true } },
    { skip: !id }
  )

  const isUpdate = !isUndefined(data)
  const i18nKey = isUpdate ? 'update' : 'create'

  return (
    <Page
      sx={{
        pt: 0,
      }}
      isLoading={isLoading}
      title={t(`forms.create-update.title.${i18nKey}`, { quizz: data?.name })}
    >
      <Header
        title={t(`forms.create-update.title.${i18nKey}`, { quizz: data?.name })}
        description={t(`forms.create-update.description.${i18nKey}`)}
      />

      {!isUpdate && (
        <>
          <Box>
            <Button onClick={() => setIsImport(true)} variant="outlined">
              {t('import.cta')}
            </Button>
          </Box>
          <ImportQuizzModal
            open={isImport}
            onClose={() => setIsImport(false)}
            onImport={(quizz) => {
              setImportedQuizz(quizz)
              setIsImport(false)
            }}
          />
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <QuizzForm
        key={importedQuizz?.name}
        isUpdate={isUpdate}
        i18nKey={i18nKey}
        isImport={Boolean(importedQuizz)}
        quizz={isUpdate ? data : importedQuizz}
      />
    </Page>
  )
}
