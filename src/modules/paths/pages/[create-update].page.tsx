import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Page } from '../../ui/components/Page/Page.component'
import { PathForm } from '../components/PathForm/PathForm.component'
import { usePath } from '../hooks/usePath.hook'

export const CreateUpdatePathPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  const { data, isLoading } = usePath(slug)

  return (
    <Page
      isLoading={isLoading}
      className="h-full flex items-center justify-center"
      title={`${
        slug ? t('shared.common.actions.edit') : t('shared.common.actions.add')
      } ${t('pathManagement.path')}`}
    >
      <PathForm path={data} />
    </Page>
  )
}
