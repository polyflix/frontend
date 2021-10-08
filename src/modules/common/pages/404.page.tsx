import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { FilledButton } from '../../ui/components/Buttons/FilledButton/FilledButton.component'
import { Page } from '../../ui/components/Page/Page.component'
import { Paragraph } from '../../ui/components/Typography/Paragraph/Paragraph.component'
import { Typography } from '../../ui/components/Typography/Typography.component'

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('notFound.seo.title')}
      className="flex items-center justify-center flex-col"
    >
      <div className="flex flex-col items-center justify-center">
        <Typography
          as="h1"
          className="text-nx-red text-6xl"
          bold
          overrideDefaultClasses
        >
          404
        </Typography>

        <Typography as="h1" className="text-3xl">
          {t('notFound.content.title')} !
        </Typography>

        <Paragraph className="my-4">
          {t('notFound.content.description')}
        </Paragraph>

        <Link to="/">
          <FilledButton as="button">{t('notFound.content.home')}</FilledButton>
        </Link>
      </div>
    </Page>
  )
}
