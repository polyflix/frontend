import { PictureAsPdf } from '@mui/icons-material'
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { capitalize } from 'lodash'
import { Link } from 'react-router-dom'

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
        <Icon name="carbon:user-certification" size={30} />
      </ListItemIcon>
      <ListItemText>
        <Stack justifyContent="space-between" direction="column">
          <Typography
            variant="body1"
            component={Link}
            to={`/certificate/${certificate.id}`}
            target="_blank"
          >
            {certificate.certification.name}
          </Typography>
          <Typography variant="body1">
            {capitalize(`${certificate.firstName} ${certificate.lastName}`)}
          </Typography>
          <Typography variant="caption">
            {dayjs(certificate.createdAt).format('MM/DD/YYYY')}
          </Typography>
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
