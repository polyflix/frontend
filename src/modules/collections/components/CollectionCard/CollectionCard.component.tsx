import { Box, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { clampString } from '@core/utils/text.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Collection } from '@collections/models/collection.model'
import { useDeleteCollectionMutation } from '@collections/services/collection.service'

import { CardFooterStyle, RootStyle } from './CollectionCard.style'

type CollectionCardProps = {
  collection: Collection
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const { t } = useTranslation('collections')
  const { user } = useAuth()

  const [deleteCollection] = useDeleteCollectionMutation()
  const handleDelete = () => {
    deleteCollection({ slug: collection.slug })
  }

  const draftStyle = collection.draft && {
    opacity: 0.3,
  }

  return (
    <RootStyle variant="outlined" draft={(!!collection.draft).toString()}>
      {/** The thing with collection.draft is meant to be here because DOM cannot parse it if it's not a string **/}
      <Link
        component={RouterLink}
        to={`/collections/${collection.slug}`}
        underline="none"
        color="inherit"
        sx={{ height: '100%' }}
      >
        <Stack spacing={2} direction="row" sx={{ p: 2, maxHeight: '125px' }}>
          <Box sx={{ pt: 1, ...draftStyle }}>
            <Icon name="bx:bx-collection" size={30} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1, ...draftStyle }}>
              {collection.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-word', ...draftStyle }}
            >
              {clampString(collection.description, 110)}
            </Typography>
          </Box>
        </Stack>
      </Link>
      {collection.elements && (
        <CardFooterStyle className="card-footer">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            <Typography variant="body2" sx={{ ...draftStyle }}>
              {t('explore.collectionCard.footer.content', {
                count: collection.elements.length,
              })}
            </Typography>
            {collection?.user?.id === user?.id && (
              <CardMenu
                updateHref={`/collections/${collection.slug}/update`}
                onDelete={handleDelete}
              />
            )}
          </Stack>
        </CardFooterStyle>
      )}
    </RootStyle>
  )
}
