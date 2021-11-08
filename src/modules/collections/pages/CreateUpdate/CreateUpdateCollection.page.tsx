import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { CollectionForm } from '@collections/components/Forms/CollectionForm.component'
import { useGetCollectionQuery } from '@collections/services/collection.service'

// const FormContainer = () => {
//   <CollectionForm collection={collection} isUpdate={isUpdate} />
// }

export const CreateUpdateCollectionPage = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: collection, isLoading } = useGetCollectionQuery({
    id: slug ?? '',
    filters: {
      join: [{ field: 'elements' }],
    },
  })

  const { t } = useTranslation('collections')

  const isUpdate = !isUndefined(slug)

  const i18nKey = isUpdate ? 'update' : 'create'

  return (
    <Page
      isLoading={isLoading}
      title={t(`forms.create-update.title.${i18nKey}`, {
        collection: collection?.name,
      })}
    >
      <Header
        title={t(`forms.create-update.title.${i18nKey}`, {
          collection: collection?.name,
        })}
        description={t(`forms.create-update.description.${i18nKey}`)}
      />
      <CollectionForm collection={collection} isUpdate={isUpdate} />
    </Page>
  )
}
