import { CreateCertificateModal } from '@admin/components/certifications/CertificateForm/EditCertificationModal'
import { Add, PictureAsPdf } from '@mui/icons-material'
import { Skeleton } from '@mui/lab'
import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
} from '@mui/material'
import dayjs from 'dayjs'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useDownloadCertificatePdf } from '@certifications/hooks/useDownloadCertificatePdf.hook'
import {
  Certificate,
  Certification,
} from '@certifications/models/certification.model'
import { useGetCertificatesByCertificationQuery } from '@certifications/services/certification.service'

type PropsCertificatesList = {
  certification: Certification
}

export const CertificatesList = ({ certification }: PropsCertificatesList) => {
  const { t } = useTranslation('administration')
  const ghosts = buildSkeletons(3)
  const [selected, setSelected] = useState<Certificate>()
  const {
    data: results,
    isLoading,
    refetch,
  } = useGetCertificatesByCertificationQuery({
    id: certification.id!,
  })

  const { download: downloadPdf, isPdfLoading } = useDownloadCertificatePdf()

  return !isLoading && results && results.data ? (
    <>
      <Button
        onClick={() =>
          setSelected({
            certification: certification,
            createdAt: '',
            firstName: '',
            lastName: '',
            id: undefined,
          })
        }
        startIcon={<Add />}
        variant="contained"
      >
        {t('certifications.page.certificate.add')}
      </Button>
      <List>
        {results.data.length !== 0
          ? results?.data?.map((certificate: Certificate, i: number) => (
              <div key={certificate.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      onClick={() => downloadPdf(certificate)}
                      disabled={isPdfLoading}
                    >
                      <PictureAsPdf />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="column">
                          <Box>
                            {capitalize(
                              `${certificate.firstName} ${certificate.lastName}`
                            )}
                          </Box>
                          <Box>
                            {dayjs(certificate.createdAt).format(
                              t('certifications.page.certificate.date')
                            )}
                          </Box>
                        </Stack>
                        <Link
                          to={`/certificate/${certificate.id}`}
                          target="_blank"
                        >
                          {`id: ${certificate.id}`}
                        </Link>
                      </Stack>
                    }
                  />
                </ListItem>
                {i !== results.data.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </div>
            ))
          : ghosts.map((_, i: number) => (
              <ListItem alignItems="flex-start" key={i}>
                <Skeleton animation="wave" width="100%" />
              </ListItem>
            ))}
      </List>
      <CreateCertificateModal
        onClose={() => setSelected(undefined)}
        key={selected?.id}
        certification={selected?.certification!}
        refetch={refetch}
      />
    </>
  ) : (
    <LoadingLayout />
  )
}
