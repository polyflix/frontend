import { CursusForm } from '@cursus/components/CursusForm/CursusForm.component'
import { useGetCursusQuery } from '@cursus/services/cursus.service'
import { CursusFilters } from '@cursus/types/filters.type'
import { Divider } from '@mui/material'
import { isUndefined } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

export const CreateUpdateCursusPage = () => {
  const { t } = useTranslation('cursus')
  const { slug } = useParams<{ slug: string }>()
  const fetchFilters = useMemo<CursusFilters>(() => ({}), [])

  const { data, isLoading } = useGetCursusQuery(
    { slug, filters: fetchFilters },
    { skip: !slug }
  )

  const i18nKey = isUndefined(data) ? 'create' : 'update'

  return (
    <Page isLoading={isLoading} title={t('form.upsert.title.create')}>
      <Header
        title={t(`form.upsert.title.${i18nKey}`)}
        description={t(`form.upsert.description.${i18nKey}`)}
      />
      <Divider sx={{ my: 3 }} />

      <CursusForm cursus={data} />
    </Page>
  )
}
