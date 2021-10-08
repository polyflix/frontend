import { useInjection } from '@polyflix/di'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

import { WithClassname, WithMotion } from '../../../common'
import { Video } from '../../../videos'
import { VideoService } from '../../../videos/services'
import { VideoList } from '../VideoList/VideoList.component'

type Props = WithClassname &
  WithMotion & { addVideo: (video: Video) => void; placeholder: string }

export const SearchCollection: React.FC<Props> = ({
  addVideo,
  placeholder,
  ...rest
}) => {
  const videoService = useInjection<VideoService>(VideoService)

  const [input, setInput] = useState<string>('')
  const [videoList, setVideoList] = useState<Video[]>([])

  const onClickVideo = (video: Video) => {
    addVideo(video)
    setInput('')
    setVideoList([])
  }

  const search = async (title: string) => {
    let paginatedVideos = await videoService.getVideos({ title, exact: false })
    setInput(title)
    setVideoList(paginatedVideos.items)
  }

  return (
    <motion.div
      {...rest}
      className="flex flex-col divide-y-2 divide-gray-300 dark:bg-nx-white rounded-md overflow-hidden col-span-2 px-2"
    >
      <input
        type="text"
        className="dark:bg-nx-white focus:outline-none py-3 px-3 font-display"
        value={input}
        onChange={(e) => search(e.target.value)}
        placeholder={placeholder}
      />
      {input && videoList.length !== 0 ? (
        <VideoList
          onClickVideo={onClickVideo}
          videoList={videoList}
          className="col-span-2"
        />
      ) : null}
    </motion.div>
  )
}
