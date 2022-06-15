import { CertificationForm } from '@admin/components/certifications/CertificateForm/CertificationForm.component'
import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { useGetCertificationQuery } from '@certifications/services/certification.service'

export const AdminFormCertificatePage = () => {
  const { t } = useTranslation('administration')

  const { slug } = useParams<{ slug: string }>()

  const isUpdate = !isUndefined(slug)

  const { data, isLoading } = useGetCertificationQuery({ id: slug })

  return (
    <Page
      isLoading={isLoading}
      title={t(`certifications.form.actions.create`, {
        group: data?.name,
      })}
    >
      <Header
        title={t(`certifications.form.actions.create`, {
          group: data?.name,
        })}
      />
      <CertificationForm isUpdate={isUpdate} certification={data} />
    </Page>
  )
}
