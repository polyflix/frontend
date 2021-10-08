import { DocumentTextIcon, XIcon } from '@heroicons/react/outline'
import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'

import { cn } from '../../../common'
import { Alert, Paragraph, Title, Typography } from '../../../ui'
import { Dropzone } from '../../../ui/components/Dropzone/Dropzone.component'
import { useQuizzImport } from '../../hooks/useQuizzImport.hook'
import { QuizzForm } from '../QuizzForm/QuizzForm.component'

const FileExample = () => (
  <div className="bg-black p-5 rounded-md">
    <Typography as="p" className="font-light text-sm italic leading-6">
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
  </div>
)

export const QuizzImport = () => {
  const { t } = useTranslation('resources')

  const { isValid, data, importFile, clear, validate, error } = useQuizzImport()

  const buildImportContent = () => {
    const isValidationDisabled = !data

    return (
      <div className="text-nx-white w-10/12 mx-auto">
        <Title>{t('quizzes.import.title')}</Title>
        <Paragraph className="my-4">{t('quizzes.import.subtitle')}</Paragraph>
        <div className="grid grid-cols-2 gap-4 my-8">
          <Dropzone
            disabled={!isUndefined(data)}
            onDrop={importFile}
            accept=".txt"
          />
          <div className="bg-darkgray flex flex-col justify-between rounded-md p-5">
            <Title overrideDefaultClasses className="font-bold text-lg">
              {t('quizzes.import.file.label')}
            </Title>
            <div className="my-4">
              {data ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-6" />
                    <h3 className="mx-2 text-sm">{data.file.name}</h3>
                  </div>
                  <div className="text-nx-red">
                    <XIcon onClick={clear} className="w-6 cursor-pointer" />
                  </div>
                </div>
              ) : (
                <Typography as="p" className="text-sm">
                  {t('quizzes.import.file.noFile')}
                </Typography>
              )}
            </div>
            <button
              onClick={validate}
              disabled={isValidationDisabled}
              className={cn(
                'w-min text-sm px-4 py-2 rounded-md',
                isValidationDisabled
                  ? 'bg-lightgray cursor-not-allowed'
                  : 'bg-green-500 cursor-pointer'
              )}
            >
              {t('quizzes.import.file.validate')}
            </button>
          </div>
        </div>
        {error && (
          <Alert className="my-4" type="error">
            {error}
          </Alert>
        )}
        <div className="bg-darkgray rounded-md p-5">
          <Title overrideDefaultClasses className="text-xl font-bold ">
            {t('quizzes.import.example.label')}
          </Title>
          <Paragraph className="my-4 text-sm" overrideDefaultClasses>
            {t('quizzes.import.example.description')}
            <ul className="px-8 my-4">
              {['delimiter', 'alternatives', 'answers'].map((rule, index) => (
                <li
                  key={index}
                  className={cn('list-disc', index <= 2 && 'my-4')}
                >
                  {t(`quizzes.import.example.rules.${rule}`)}
                </li>
              ))}
            </ul>
          </Paragraph>
          <FileExample />
        </div>
      </div>
    )
  }

  return (
    <div>
      {!isValid && buildImportContent()}
      {data && isValid && <QuizzForm isUpdate={false} quizz={data.quizz} />}
    </div>
  )
}
