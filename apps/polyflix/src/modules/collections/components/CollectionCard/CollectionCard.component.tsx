import { Box, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { DraftTag } from '@core/components/Chip/Draft.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { VisibilityIcons } from '@core/components/Visibility/Icons/VisibilityIcons.component'
import { clampString } from '@core/utils/text.utils'

import { Collection } from '@collections/models/collection.model'
import { useDeleteCollectionMutation } from '@collections/services/collection.service'

import { CardFooterStyle, RootStyle } from './CollectionCard.style'

type CollectionCardProps = {
  collection: Collection
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const { t } = useTranslation('collections')

  const [deleteCollection] = useDeleteCollectionMutation()
  const handleDelete = () => {
    deleteCollection({ slug: collection.slug })
  }

  return (
    <RootStyle variant="outlined">
      {/** The thing with collection.draft is meant to be here because DOM cannot parse it if it's not a string **/}
      <Link
        component={RouterLink}
        to={`/modules/${collection.slug}`}
        underline="none"
        color="inherit"
        sx={{ height: '100%' }}
      >
        {collection.draft && (
          <DraftTag
            size="small"
            variant="outlined"
            label={t('explore.collectionCard.tags.draft')}
          />
        )}
        <Stack spacing={2} direction="row" sx={{ p: 2, maxHeight: '125px' }}>
          <Box sx={{ pt: 1 }}>
            <Icon name="bx:bx-collection" size={30} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              <VisibilityIcons visibility={collection!.visibility!} />
              {collection.name}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
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
            <Typography variant="body2">
              {t('explore.collectionCard.footer.content', {
                count: collection.elements.length,
              })}
            </Typography>
            <CardMenu
              updateHref={`/modules/${collection.slug}/update`}
              onDelete={handleDelete}
              publisherId={collection?.user?.id}
              type="collections"
            />
          </Stack>
        </CardFooterStyle>
      )}
    </RootStyle>
  )
}
