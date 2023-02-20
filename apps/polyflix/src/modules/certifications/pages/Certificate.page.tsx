import { PictureAsPdf } from '@mui/icons-material'
import ShareIcon from '@mui/icons-material/Share'
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Page } from '@core/components/Page/Page.component'
import { PublicDashboardLayout } from '@layouts/Dashboard/PublicDashboard.layout'

import { useDownloadCertificatePdf } from '@certifications/hooks/useDownloadCertificatePdf.hook'
import { useGetCertificateQuery } from '@certifications/services/certification.service'

export const CertificatePage = () => {
  const { t } = useTranslation('certifications')
  const { id } = useParams<{ id: string }>()

  const { data: certificate, isLoading } = useGetCertificateQuery({ id })
  const { download, isPdfLoading } = useDownloadCertificatePdf()

  return (
    <PublicDashboardLayout>
      <Page
        isLoading={isLoading}
        title={t('explore.title')}
        maxWidth={false}
        disableGutters={true}
      >
        {certificate ? (
          <Card
            variant="outlined"
            sx={{
              marginX: '9em',
            }}
          >
            <CardContent>
              <Grid
                container
                spacing={2}
                sx={{
                  height: '70vh',
                  width: '100%',
                  padding: '1em',
                }}
              >
                <Grid item xs={2}>
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="stretch"
                  >
                    <Typography variant="h4">Polyflix University</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={9}>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <div>
                      <div>
                        <Typography>{t('data.owner1')}</Typography>
                        <Typography variant="h2">
                          {certificate.firstName} {certificate.lastName}{' '}
                        </Typography>
                        <Typography>{t('data.owner2')}</Typography>
                        <Typography variant="h3">
                          {certificate.certification.name}
                        </Typography>
                        <br />
                        <Typography>
                          {t('data.date')}{' '}
                          {dayjs(certificate.createdAt).format(
                            t('data.dateFormat')
                          )}
                        </Typography>
                      </div>
                      <br />
                      <Typography>
                        {t('explore.title')}: <b>{id}</b>
                      </Typography>
                    </div>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <IconButton
                aria-label="share"
                onClick={() => {
                  window.open(
                    `
                https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${
                  certificate.certification.name
                }&organizationName=Polyflix&issueYear=${dayjs(
                      certificate.createdAt
                    ).year()}&issueMonth=${dayjs(
                      certificate.createdAt
                    ).month()}&certUrl=https://polyflix.dopolytech.fr/certificate/${id}&certId=${id}
                `,
                    '_blank'
                  )
                }}
              >
                <ShareIcon />
                <Typography>{t('explore.addLinkedin')}</Typography>
              </IconButton>
              <IconButton
                disabled={isPdfLoading}
                onClick={() => download(certificate)}
              >
                <PictureAsPdf />
              </IconButton>
            </CardActions>
          </Card>
        ) : (
          <div>{t('empty')}</div>
        )}
      </Page>
    </PublicDashboardLayout>
  )
}
