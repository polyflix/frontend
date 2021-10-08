import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'

import { useAuth } from '../../../authentication/hooks/useAuth.hook'
import { Paginator } from '../../../common/components/Paginator/Paginator.component'
import { usePagination } from '../../../common/hooks/usePagination.hook'
import { OrderEnum } from '../../../common/types/OrderEnum'
import { buildQueryOrdering } from '../../../common/utils/order.util'
import { fadeOpacity } from '../../../ui/animations/fadeOpacity'
import { Container } from '../../../ui/components/Container/Container.component'
import { Page } from '../../../ui/components/Page/Page.component'
import { Title } from '../../../ui/components/Typography/Title/Title.component'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import { VideoListItem } from '../../../videos/components/VideoListItem/VideoListItem.component'
import { useVideos } from '../../../videos/hooks/useVideos.hook'
import { Video } from '../../../videos/models/video.model'

export const UserVideosHistoryPage: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { setFinalPage, page, to, limit } = usePagination()
  const { goBack } = useHistory()
  const [ordering, setOrdering] = useState<OrderEnum>(OrderEnum.DESC)

  const { data, isLoading: isLoadingVideo } = useVideos(
    {
      order: buildQueryOrdering('userMeta.updatedAt', ordering),
      page,
      pageSize: limit,
      isWatching: true,
      isWatched: true,
    },
    setFinalPage
  )

  const onToggleOrder = () => {
    if (ordering === OrderEnum.DESC) setOrdering(OrderEnum.ASC)
    else setOrdering(OrderEnum.DESC)
  }

  if (!user?.id) return <Redirect to="/not-found" />

  return (
    <Page
      isLoading={isLoadingVideo}
      variants={fadeOpacity}
      title={t('userVideos.seo.ownHistory')}
    >
      <Container mxAuto className="px-5 flex flex-col">
        <div className="flex items-center justify-between">
          <Title className="my-5">{t('userVideos.seo.ownHistory')}</Title>
          <Typography
            as="span"
            className="flex items-center text-nx-red"
            overrideDefaultClasses
          >
            <span
              className="text-nx-gray inline-flex mx-2 cursor-pointer"
              onClick={onToggleOrder}
            >
              {ordering === OrderEnum.DESC ? (
                <ArrowUpIcon className="w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 mr-1" />
              )}
              {t(
                'shared.common.filters.' +
                  (ordering === OrderEnum.DESC ? 'newest' : 'oldest')
              )}
            </span>
            <span className="inline-flex mx-2 cursor-pointer" onClick={goBack}>
              <ArrowCircleLeftIcon className="w-6 mr-1" />{' '}
              {t('shared.common.actions.back')}{' '}
            </span>
          </Typography>
        </div>
        {data && (
          <>
            {data.items.map((video: Video) => (
              <VideoListItem key={video.id} video={video} ownerItems={false} />
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
                {t('userVideos.list.historyNoVideos')}
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  )
}
