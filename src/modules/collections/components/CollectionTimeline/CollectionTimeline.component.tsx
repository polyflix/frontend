import { Timeline } from '@mui/lab'
import { Alert, Stack, Skeleton } from '@mui/material'
// import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CollectionTimelineSkeleton } from '@collections/components/CollectionTimelineSkeleton/CollectionTimelineSkeleton.component'
import { Collection } from '@collections/models/collection.model'
import { useGetCollectionQuery } from '@collections/services/collection.service'

import { ItemCollectionTimeline } from './ItemCollectionTimeline.component'

type CollectionTimelineProps = {
  collectionSlug: string
}

export const CollectionTimeline = ({
  collectionSlug,
}: CollectionTimelineProps) => {
  const { data, isLoading } = useGetCollectionQuery({
    slug: collectionSlug,
  })
  const collection: Collection | undefined = data
  const { t } = useTranslation('collections')

  return (
    <Timeline position="right">
      {collection?.elements?.length === 0 && (
        <Alert severity="info">{t('noData.empty')}</Alert>
      )}
      {isLoading && (
        <Stack spacing={1}>
          <Skeleton variant="text" width="70%" />
          <CollectionTimelineSkeleton />
        </Stack>
      )}
      {collection?.elements?.map((item, i: number) => {
        return (
          <ItemCollectionTimeline
            key={i}
            index={i}
            element={item}
            collectionSlug={collection?.slug}
            isLast={collection?.elements?.length == i - 1}
          />
        )
      })}
    </Timeline>
  )
}
