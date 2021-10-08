import React from 'react'

import { applyBackgroundImage } from '../../../common/utils/classes.util'
import { Paragraph } from '../../../ui'
import { NoData } from '../../../ui/components/NoData/NoData.component'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import { useStreamUrl } from '../../hooks/useStreamUrl.hook'
import { Video } from '../../models/video.model'
import { VideoSource } from '../../types'
import { VideoButtons } from '../VideoButtons/VideoButton.component'

type Props = {
  video: Video
}

export const VideoHero: React.FC<Props> = ({ video }) => {
  const { streamUrl, error, loading } = useStreamUrl(video)

  return video ? (
    <>
      <div
        style={applyBackgroundImage(video.thumbnail)}
        className="relative flex items-center justify-center h-screen mb-12 overflow-hidden"
      >
        <div className="absolute z-30 p-5 text-2xl text-white h-full flex flex-col justify-center left-0 items-start bg-gradient-to-r from-black">
          <Typography as="h1" className="text-4xl md:text-6xl" bold>
            {video.shortTitle}
          </Typography>
          <Paragraph className="my-5">{video.shortDescription}</Paragraph>
          <VideoButtons video={video} />
        </div>
        {video && video.srcType === VideoSource.INTERNAL && !loading && !error && (
          <video
            autoPlay
            loop
            muted
            className="absolute z-10 min-w-full min-h-full max-w-none w-full h-full object-cover"
          >
            <source src={streamUrl} type="video/mp4" />
          </video>
        )}
      </div>
    </>
  ) : (
    <div
      style={{
        minHeight: '200px',
        height: '80vh',
      }}
      className="flex items-center justify-center border-b-2 border-nx-dark"
    >
      <NoData />
    </div>
  )
}
