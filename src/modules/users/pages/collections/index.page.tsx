import { PlusIcon } from '@heroicons/react/outline'
import { useInjection } from '@polyflix/di'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../authentication/hooks'
import { CollectionListItem } from '../../../collections/components'
import { useCollections } from '../../../collections/hooks'
import { Collection } from '../../../collections/models'
import { CollectionService } from '../../../collections/services'
import { CollectionsWithPagination } from '../../../collections/types'
import { Paginator } from '../../../common/components/Paginator/Paginator.component'
import { usePagination } from '../../../common/hooks'
import { fadeOpacity, Typography } from '../../../ui'
import { Container } from '../../../ui/components/Container/Container.component'
import { Page } from '../../../ui/components/Page/Page.component'
import { Title } from '../../../ui/components/Typography/Title/Title.component'
import { useUser } from '../../hooks'

export const UserCollectionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { t } = useTranslation()
  const collectionService = useInjection<CollectionService>(CollectionService)
  const { page, to, limit } = usePagination()
  const isOwnPage = user?.id === id

  const { data: fetchedUser, isLoading: isLoadingUser } = useUser({
    id,
  })

  const {
    data,
    isLoading: isLoadingVideo,
    alert,
    refresh,
  } = useCollections<CollectionsWithPagination>({
    publisherId: id,
    page,
    pageSize: limit,
    mode: 'collection',
    order: '-updatedAt',
  })

  const onCollectionDelete = async (collectionId: string) => {
    await collectionService.deleteCollection(collectionId)
    refresh()
  }

  if (alert && alert.type === 'not-found') return <Redirect to="/not-found" />
  return (
    <Page
      isLoading={isLoadingVideo || isLoadingUser}
      variants={fadeOpacity}
      title={
        isOwnPage
          ? t('userCollections.seo.ownTitle')
          : t('userCollections.seo.userTitle', {
              user: fetchedUser?.displayName,
            })
      }
    >
      <Container mxAuto className="px-5 flex flex-col">
        {alert && alert.type === 'error' && (
          <div className="bg-nx-red-dark w-1/4 text-white font-extrabold rounded flex text-center justify-center self-center">
            {`${alert.message}`}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Title className="my-5">
            {isOwnPage
              ? t('userCollections.seo.ownTitle')
              : t('userCollections.seo.userTitle', {
                  user: fetchedUser?.displayName,
                })}
          </Title>
          {isOwnPage && (
            <Typography
              as="span"
              className="flex items-center text-nx-red"
              overrideDefaultClasses
            >
              <Link to="/collections/create">
                <span className="inline-flex mx-2 truncate">
                  <PlusIcon className="w-6" /> {t('shared.common.actions.add')}{' '}
                  {t('collectionManagement.collection')}
                </span>
              </Link>
            </Typography>
          )}
        </div>
        {data && (
          <>
            {data.items.map((collection: Collection) => (
              <CollectionListItem
                key={collection.id}
                onDelete={() => onCollectionDelete(collection.id)}
                collection={collection}
                ownerItems={isOwnPage}
              />
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
                {' '}
                {isOwnPage
                  ? t('userCollections.list.ownNoCollections')
                  : t('userCollections.list.userNoCollections', {
                      user: fetchedUser?.displayName,
                    })}
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  )
}
