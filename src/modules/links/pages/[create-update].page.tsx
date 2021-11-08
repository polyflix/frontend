import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { LinkForm } from '@links/components/LinkForm.components'
import { useGetLinkQuery } from '@links/services/link.service'

export const CreateUpdatePage = () => {
  const { id } = useParams<{ id: string }>()

  // We want to fetch the video only if the slug is defined, in case of update mode.
  const { data: link, isLoading } = useGetLinkQuery({ id }, { skip: !id })

  const isUpdate = !isUndefined(link)

  const { t } = useTranslation('links')

  const i18nKey = !isUndefined(link) ? 'update' : 'create'

  return (
    <Page
      isLoading={isLoading}
      title={t(`forms.create-update.title.${i18nKey}`, { link: link?.name })}
    >
      <Header
        title={t(`forms.create-update.title.${i18nKey}`, {
          link: link?.name,
        })}
        description={t(`forms.create-update.description.${i18nKey}`)}
      />

      <LinkForm link={link} isUpdate={isUpdate} />
    </Page>
  )
}
