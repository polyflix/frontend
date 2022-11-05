import { CreateCertificateModal } from '@admin/components/certifications/CertificateForm/EditCertificationModal'
import { Add } from '@mui/icons-material'
import { Skeleton } from '@mui/lab'
import { Button, List, ListItem } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { buildSkeletons } from '@core/utils/gui.utils'

import { ProfileCertificationsListItem } from '@certifications/components/ProfileCertificationsListItem.component'
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

  const displayGhost = () =>
    ghosts.map((_, i: number) => (
      <ListItem alignItems="flex-start" key={i}>
        <Skeleton animation="wave" width="100%" />
      </ListItem>
    ))

  const displayContent = () => {
    return results?.data?.map((certificate: Certificate, i: number) => (
      <ProfileCertificationsListItem key={i} certificate={certificate} />
    ))
  }

  const isEmpty = () => !isLoading && results && results?.data?.length === 0

  return (
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
      <CreateCertificateModal
        onClose={() => setSelected(undefined)}
        key={selected?.id}
        certification={selected?.certification!}
        refetch={refetch}
      />
      {!isEmpty() && (
        <>
          <List>{isLoading ? displayGhost() : displayContent()}</List>
        </>
      )}
    </>
  )
}
