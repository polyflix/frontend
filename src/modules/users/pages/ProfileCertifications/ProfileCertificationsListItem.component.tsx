import { PictureAsPdf } from '@mui/icons-material'
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
} from '@mui/material'
import dayjs from 'dayjs'

import { Icon } from '@core/components/Icon/Icon.component'

import { useDownloadCertificatePdf } from '@certifications/hooks/useDownloadCertificatePdf.hook'
import { Certificate } from '@certifications/models/certification.model'

type Props = {
  certificate: Certificate
}
export const ProfileCertificationsListItem = ({ certificate }: Props) => {
  const { download, isPdfLoading } = useDownloadCertificatePdf()

  return (
    <ListItem
      component={Paper}
      variant="outlined"
      sx={{ mb: 1 }}
      secondaryAction={
        <IconButton
          disabled={isPdfLoading}
          onClick={() => download(certificate)}
        >
          <PictureAsPdf />
        </IconButton>
      }
    >
      <ListItemIcon>
        <IconButton>
          <Icon name="carbon:user-certification" size={30} />
        </IconButton>
      </ListItemIcon>
      <ListItemText>
        <Stack justifyContent="space-between" direction="column">
          <Box>{certificate.certification.name}</Box>
          <Box>{dayjs(certificate.createdAt).format('MM/DD/YYYY')}</Box>
        </Stack>
      </ListItemText>
    </ListItem>
  )
}

export const ProfileCertificationsListItemSkeleton = () => {
  return (
    <ListItem component={Paper} variant="outlined" sx={{ mb: 1 }}>
      <ListItemIcon>
        <IconButton>
          <Icon name="carbon:user-certification" size={30} />
        </IconButton>
      </ListItemIcon>
      <Skeleton variant="text" width="100%" />
    </ListItem>
  )
}
