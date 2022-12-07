import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { useQuery } from '@core/hooks/useQuery'

import { CollectionTimeline } from '@collections/components/CollectionTimeline/CollectionTimeline.component'

export const CollectionPanel = () => {
  const query = useQuery() as URLSearchParams

  return (
    <AutoScrollBox>
      <CollectionTimeline collectionSlug={query.get('c')!} />
    </AutoScrollBox>
  )
}
