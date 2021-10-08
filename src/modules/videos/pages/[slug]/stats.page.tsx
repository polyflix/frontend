import { motion } from 'framer-motion'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { GoBack } from '../../../common/components/Navigation/GoBack.component'
import { useFetch } from '../../../common/hooks/useFetch.hook'
import { StatTile } from '../../../stats/components/StatTile.component'
import { ResponsiveViewChart } from '../../../stats/components/ViewChart.component'
import { StatsService } from '../../../stats/services/stats.service'
import { StatView } from '../../../stats/types/StatView.type'
import {
  Container,
  fadeOpacity,
  GhostTile,
  Image,
  Page,
  stagger,
  Typography,
} from '../../../ui'
import { GhostParagraph } from '../../../ui/components/Ghost/GhostParagraph'
import { GhostStatTile } from '../../../ui/components/Ghost/GhostStatTile.component'
import { useVideo } from '../../hooks/useVideo.hook'
import { Video } from '../../models'

type HeadStatsProps = {
  likesCount: number
  viewsCount: number
}

const HeadStats: React.FC<HeadStatsProps> = ({ likesCount, viewsCount }) => {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-12 gap-5 my-10 lg:divide-x lg:divide-red-700">
      <StatTile
        title={`${t('shared.common.views')} ${t(
          'shared.common.dates.thisWeek'
        ).toLowerCase()}`}
        number={viewsCount.toString()}
      />
      <StatTile
        title={`${t('shared.common.likes')} ${t(
          'shared.common.dates.thisWeek'
        ).toLowerCase()}`}
        number={likesCount.toString()}
      />
      <StatTile
        title={`${t('shared.common.comments')} ${t(
          'shared.common.dates.thisWeek'
        ).toLowerCase()}`}
        number={`${t('shared.common.dates.soon')} 👀`}
      />
    </div>
  )
}

const HeadStatsGhost: React.FC = () => (
  <>
    {new Array(3).fill(0).map((_, index) => (
      <GhostStatTile key={index} />
    ))}
  </>
)

const VideoShortView: React.FC<{ video: Video }> = ({ video }) => {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <div className="col-span-12 md:col-span-4 xl:col-span-2 ">
        <Link to={video.getStreamLink()}>
          <Image
            src={video.thumbnail}
            className="rounded-md w-full md:h-32 object-cover"
            alt={`${video.title} thumbnail`}
          />
        </Link>
      </div>
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <Typography bold className="text-lg md:text-xl" as="h3">
          {video.title}
          <span className="text-nx-gray text-sm text-opacity-60 pl-4">
            {t('shared.common.createdAt', {
              date: new Date(video.createdAt).toLocaleDateString(),
            })}
          </span>
        </Typography>
        <Typography as="p">{video.shortDescription}</Typography>
      </div>
    </div>
  )
}

const VideoShortViewGhost: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      <div className="col-span-12 md:col-span-4 xl:col-span-2 ">
        <GhostTile aspectRatio={true} />
      </div>
      <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
        <GhostParagraph count={4} />
      </div>
    </div>
  )
}

export const StatsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const {
    data: video,
    isLoading: isVideoLoading,
    alert: alertVideo,
  } = useVideo(slug)
  const {
    data: stats,
    isLoading: isStatsLoading,
    alert: alertStats,
  } = useFetch<StatView, StatsService>(StatsService, 'getVideoStats', [slug])

  if (alertVideo || alertStats) return <Redirect to="/not-found" />

  return (
    <Page
      withNavbar={true}
      variants={fadeOpacity}
      title={`Stats - ${video?.title ?? 'loading...'}`}
      isLoading={isVideoLoading}
    >
      <motion.div
        variants={stagger(0.1)}
        className="p-5 w-full md:w-8/12 mx-auto"
      >
        <GoBack />
        <Container mxAuto fluid className="p-4 pb-8 text-white">
          {video ? <VideoShortView video={video} /> : <VideoShortViewGhost />}
          {isStatsLoading || !stats ? (
            <HeadStatsGhost />
          ) : (
            <HeadStats
              likesCount={stats.likesCount}
              viewsCount={stats.viewsCount}
            />
          )}
          <div className="h-96 w-full">
            {!isStatsLoading && stats && (
              <ResponsiveViewChart data={stats.views} />
            )}
          </div>
        </Container>
      </motion.div>
    </Page>
  )
}
