import { ClockIcon, PlusIcon } from '@heroicons/react/outline'
import { useInjection } from '@polyflix/di'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../authentication/hooks/useAuth.hook'
import { Paginator } from '../../../common/components/Paginator/Paginator.component'
import { usePagination } from '../../../common/hooks/usePagination.hook'
import { fadeOpacity } from '../../../ui/animations/fadeOpacity'
import { Container } from '../../../ui/components/Container/Container.component'
import { Page } from '../../../ui/components/Page/Page.component'
import { Title } from '../../../ui/components/Typography/Title/Title.component'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import { VideoListItem } from '../../../videos/components/VideoListItem/VideoListItem.component'
import { useVideos } from '../../../videos/hooks/useVideos.hook'
import { Video } from '../../../videos/models/video.model'
import { VideoService } from '../../../videos/services/video.service'
import { useUser } from '../../hooks/useUser.hook'

export const UserVideosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { t } = useTranslation()
  const videoService = useInjection<VideoService>(VideoService)
  const { setFinalPage, page, to, limit } = usePagination()
  const isOwnPage = user?.id === id

  const {
    data: fetchedUser,
    isLoading: isLoadingUser,
    alert,
  } = useUser({
    id,
  })

  const {
    data,
    isLoading: isLoadingVideo,
    refresh,
  } = useVideos(
    {
      authorId: id,
      page,
      pageSize: limit,
      order: '-createdAt',
    },
    setFinalPage
  )

  const onVideoDelete = async (videoId: string) => {
    await videoService.deleteVideo(videoId)
    refresh()
  }

  if (alert && alert.type === 'not-found') return <Redirect to="/not-found" />

  return (
    <Page
      isLoading={isLoadingVideo || isLoadingUser}
      variants={fadeOpacity}
      title={
        isOwnPage
          ? t('userVideos.seo.ownTitle')
          : t('userVideos.seo.userTitle', { user: fetchedUser?.displayName })
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
              ? t('userVideos.seo.ownTitle')
              : t('userVideos.seo.userTitle', {
                  user: fetchedUser?.displayName,
                })}
          </Title>
          {isOwnPage && (
            <Typography
              as="span"
              className="flex items-center text-nx-red"
              overrideDefaultClasses
            >
              <Link to="/videos/new">
                <span className="inline-flex mx-2">
                  <PlusIcon className="w-6" /> {t('shared.common.actions.add')}{' '}
                  {t('videoManagement.video')}
                </span>
              </Link>
              <Link to="/profile/videos/history">
                <span className="text-nx-gray inline-flex mx-2">
                  <ClockIcon className="w-6 mr-1" />{' '}
                  {t('shared.common.actions.history')}{' '}
                </span>
              </Link>
            </Typography>
          )}
        </div>
        {data && (
          <>
            {data.items.map((video: Video) => (
              <VideoListItem
                onDelete={() => onVideoDelete(video.id)}
                key={video.id}
                video={video}
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
                  ? t('userVideos.list.ownNoVideos')
                  : t('userVideos.list.userNoVideos', {
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
