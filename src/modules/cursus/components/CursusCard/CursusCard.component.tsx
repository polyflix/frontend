import { Cursus } from '@cursus/models/cursus.model'
import { useDeleteCursusMutation } from '@cursus/services/cursus.service'
import { Avatar, Box, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { clampString } from '@core/utils/text.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import {
  CardFooterStyle,
  RootStyle,
} from '@collections/components/CollectionCard/CollectionCard.style'

interface Props {
  cursus: Cursus
}

export const CursusCard = ({ cursus }: Props) => {
  const { t } = useTranslation('cursus')
  const { user } = useAuth()

  const [deleteCursus] = useDeleteCursusMutation()
  const handleDelete = () => {
    deleteCursus({ slug: cursus.slug })
  }

  const draftStyle = cursus.draft && {
    opacity: 0.3,
  }
  return (
    <RootStyle
      variant="outlined"
      draft={(!!cursus.draft).toString()}
      sx={{ flexShrink: 0, flexGrow: 0, height: '280px' }}
    >
      {/** The thing with collection.draft is meant to be here because DOM cannot parse it if it's not a string **/}
      <Link
        component={RouterLink}
        to={`/cursus/${cursus.slug}`}
        underline="none"
        color="inherit"
        sx={{ height: '100%' }}
      >
        <Stack spacing={2} direction="row" sx={{ p: 2, maxHeight: '125px' }}>
          <Box sx={{ pt: 1, ...draftStyle }}>
            <Avatar
              sx={{ width: 32, height: 32 }}
              variant="circular"
              src={cursus.user?.avatar}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1, ...draftStyle }}>
              {cursus.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-word', ...draftStyle }}
            >
              {clampString(cursus.description, 110)}
            </Typography>
          </Box>
        </Stack>
      </Link>
      <CardFooterStyle className="card-footer">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <Typography variant="body2" sx={{ ...draftStyle }}>
            {t('cursusCard.footerElements', {
              count: cursus?.courses?.length || 0,
            })}
          </Typography>
          {cursus?.user?.id === user?.id && (
            <CardMenu
              updateHref={`/cursus/${cursus.slug}/update`}
              onDelete={handleDelete}
              type="cursus"
            />
          )}
        </Stack>
      </CardFooterStyle>
    </RootStyle>
  )
}
