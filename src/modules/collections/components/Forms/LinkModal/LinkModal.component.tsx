import {
  Backdrop,
  Box,
  Button,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Stack,
  Typography,
} from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Trans, useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { SnackbarService } from '@core/services/snackbar.service'

import { Collection } from '@collections/models/collection.model'

interface Props {
  open: boolean
  collection?: Collection
  onClose: () => void
}

export const LinkModal = ({ open, onClose, collection }: Props) => {
  const { t } = useTranslation('collections')
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const getUrl = (key: string) =>
    `${location.protocol}//${location.host}/modules/${collection?.slug}?accessKey=${key}`

  return (
    <Modal
      open={open}
      closeAfterTransition
      disableAutoFocus
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '70%', md: '40%' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 10,
            p: 4,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h4">{t('share.title')}</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              <Trans i18nKey={'share.description'} ns={'collections'} />
            </Typography>
            <List>
              {collection?.passwords.map(({ accessKey, name }: any) => (
                <ListItem key={accessKey}>
                  <CopyToClipboard
                    onCopy={() => {
                      snackbarService.createSnackbar(t('share.clipboard'), {
                        variant: 'success',
                      })
                    }}
                    text={getUrl(accessKey)}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Icon name="fa-solid:share-square" />
                      </ListItemIcon>
                      <ListItemText>{`${name} : ${getUrl(
                        accessKey
                      )}`}</ListItemText>
                    </ListItemButton>
                  </CopyToClipboard>
                </ListItem>
              ))}
            </List>
          </Stack>
          <Stack>
            <Button variant="outlined" onClick={onClose}>
              {t('share.cta')}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  )
}
