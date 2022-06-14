import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Page } from '@core/components/Page/Page.component'
import { PublicDashboardLayout } from '@core/layouts/Dashboard/PublicDashboard.layout'

import { useGetCertificateQuery } from '@certifications/services/certification.service'

export const CertificatePage = () => {
  const { t } = useTranslation('certifications')
  const { id } = useParams<{ id: string }>()

  const { data: certificate, isLoading } = useGetCertificateQuery({ id })

  return (
    <PublicDashboardLayout>
      <Page
        isLoading={isLoading}
        title={t('explore.title')}
        maxWidth={false}
        disableGutters={true}
      >
        {certificate ? (
          <div>
            <Typography variant="h3">
              {certificate.certification.name}
            </Typography>
            <div>
              {t('explore.title')}: {id}
            </div>
            <div>
              {t('data.owner')} {certificate.firstName} {certificate.lastName}{' '}
              {t('data.the')}{' '}
              {dayjs(certificate.createdAt).format(t('data.dateFormat'))}
            </div>
          </div>
        ) : (
          <div>{t('empty')}</div>
        )}
      </Page>
    </PublicDashboardLayout>
  )
}
