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
import { saveAs } from 'file-saver'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'
import { PdfService } from '@core/services/pdf.service'
import { SnackbarService } from '@core/services/snackbar.service'
import { buildSkeletons } from '@core/utils/gui.utils'

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
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [selected, setSelected] = useState<Certificate>()
  const {
    data: results,
    isLoading,
    refetch,
  } = useGetCertificatesByCertificationQuery({
    id: certification.id!,
  })

  const pdfService = useInjection<PdfService>(PdfService)

  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const downloadPdf = async (certificate: Certificate) => {
    try {
      setIsPdfLoading(true)
      let blob = await pdfService.getCertificatePdfQuery(certificate.id!)
      saveAs(
        blob,
        `polyflix_certification_${certification.name.toLocaleLowerCase()}}`
      )
    } catch (error) {
      snackbarService.createSnackbar(t('certifications.page.errors.pdf'), {
        variant: 'error',
      })
    } finally {
      setIsPdfLoading(false)
    }
  }

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
