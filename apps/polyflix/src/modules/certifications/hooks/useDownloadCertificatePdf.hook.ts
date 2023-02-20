import { saveAs } from 'file-saver'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { PdfService } from '@services/pdf.service'
import { SnackbarService } from '@services/snackbar.service'

import { Certificate } from '@certifications/models/certification.model'

type DownloadCertificatePdfProps = {
  download: (certificate: Certificate) => Promise<void>
  isPdfLoading: boolean
}

export const useDownloadCertificatePdf = (): DownloadCertificatePdfProps => {
  const pdfService = useInjection<PdfService>(PdfService)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('certifications')

  const downloadPdf = async (certificate: Certificate) => {
    try {
      setIsPdfLoading(true)
      let blob = await pdfService.getCertificatePdfQuery(certificate.id!)
      saveAs(
        blob,
        `polyflix_certification_${certificate.certification.name.toLocaleLowerCase()}`
      )
    } catch (error) {
      snackbarService.createSnackbar(t('errors.pdf'), {
        variant: 'error',
      })
    } finally {
      setIsPdfLoading(false)
    }
  }

  return {
    download: downloadPdf,
    isPdfLoading,
  }
}
