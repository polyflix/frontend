import { GroupFrom } from '@admin/components/groups/GroupForm/GroupForm.component'
import { useGetGroupQuery } from '@admin/services/group.service'
import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

export const AdminFromGroupPage = () => {
  const { t } = useTranslation('administration')

  const { slug } = useParams<{ slug: string }>()

  const isUpdate = !isUndefined(slug)
  const i18nKey = isUpdate ? 'update' : 'create'

  const { data, isLoading } = useGetGroupQuery(slug, { skip: !slug })

  return (
    <Page
      isLoading={isLoading}
      title={t(`groups.forms.create-update.title.${i18nKey}`, {
        group: data?.name,
      })}
    >
      <Header
        title={t(`groups.forms.create-update.title.${i18nKey}`, {
          group: data?.name,
        })}
        description={t(`groups.forms.create-update.description.${i18nKey}`)}
      />
      <GroupFrom isUpdate={isUpdate} group={data} />
    </Page>
  )
}
