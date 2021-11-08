import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { useQuery } from '@core/hooks/useQuery'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'
import { useGetCollectionQuery } from '@collections/services/collection.service'

export const CollectionPanel = () => {
  const query = useQuery() as URLSearchParams

  const { data: collection } = useGetCollectionQuery({
    slug: query.get('c')!,
    filters: {
      join: [{ field: 'elements' }],
    },
  })

  return (
    <AutoScrollBox>
      {collection && <CollectionTimeline collection={collection} />}
    </AutoScrollBox>
  )
}
