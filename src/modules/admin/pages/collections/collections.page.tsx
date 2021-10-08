import { PlusIcon } from '@heroicons/react/solid'
import { useInjection } from '@polyflix/di'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'

import { CollectionService } from '../../../collections'
import { CollectionListItem } from '../../../collections/components/CollectionListItem/CollectionListItem.component'
import { useCollections } from '../../../collections/hooks/useCollections.hook'
import { Collection } from '../../../collections/models/collections.model'
import { CollectionsWithPagination } from '../../../collections/types/collections.type'
import { Paginator } from '../../../common/components/Paginator/Paginator.component'
import { usePagination } from '../../../common/hooks/usePagination.hook'
import { fadeOpacity } from '../../../ui/animations/fadeOpacity'
import { Container } from '../../../ui/components/Container/Container.component'
import { Jumbotron } from '../../../ui/components/Jumbotron/Jumbotron.component'
import { Page } from '../../../ui/components/Page/Page.component'
import { Typography } from '../../../ui/components/Typography/Typography.component'

export const AdminCollectionPage: React.FC = () => {
  const { t } = useTranslation()
  const { page, to, limit } = usePagination()

  const collectionService = useInjection<CollectionService>(CollectionService)

  const {
    data,
    isLoading: isLoadingCollection,
    alert,
    refresh,
  } = useCollections<CollectionsWithPagination>({
    page,
    pageSize: limit,
    mode: 'collection',
  })

  if (alert && alert.type === 'not-found') return <Redirect to="/not-found" />

  const onCollectionDelete = async (id: string) => {
    await collectionService.deleteCollection(id)
    refresh()
  }

  return (
    <Page
      isLoading={isLoadingCollection}
      variants={fadeOpacity}
      title={t('admin.onBoarding.collections.title')}
    >
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t('admin.onBoarding.collections.title')}
          content={t('admin.onBoarding.question')}
        />
        <div className="mt-5">
          <Typography
            as="span"
            className="flex items-center text-nx-red"
            overrideDefaultClasses
          >
            <Link to="/collections/create">
              <span className="inline-flex mx-2">
                <PlusIcon className="w-6" /> {t('shared.common.actions.add')}
                {t('collectionManagement.collection')}
              </span>
            </Link>
          </Typography>
        </div>
        <div className="mx-5">
          {data && (
            <>
              {data.items.map((collection: Collection) => (
                <CollectionListItem
                  key={collection.id}
                  onDelete={() => onCollectionDelete(collection.id)}
                  collection={collection}
                  ownerItems={true}
                ></CollectionListItem>
              ))}
              {data.items.length > 0 ? (
                <Paginator
                  className="py-5 justify-end"
                  page={page}
                  onPageChanged={to}
                  total={Math.floor(data.totalCount / data.items.length)}
                />
              ) : (
                <div className="text-white">
                  <Typography as="h3">
                    {t('courses.error.noCourses')}
                  </Typography>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Page>
  )
}
