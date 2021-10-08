import { motion } from 'framer-motion'
import React from 'react'

import { WithClassname, WithMotion } from '../../../common/types/props.type'
import { cn } from '../../../common/utils/classes.util'
import { Video } from '../../../videos'

type Props = WithClassname &
  WithMotion & {
    videoList?: Video[]
    onClickVideo: (video: Video) => void
  }

export const VideoList: React.FC<Props> = ({
  videoList = [],
  className = '',
  onClickVideo,
  ...rest
}) => {
  return (
    <motion.div {...rest} className={cn('flex flex-col', className)}>
      <ul className="dark:bg-nx-white focus:outline-none py-1 px-1 space-y-2 font-display">
        {videoList.map((data) => {
          return (
            <li
              key={data.id}
              className="rounded-md hover:bg-gray-300 py-2 px-4 cursor-pointer"
              onClick={() => onClickVideo(data)}
            >
              {data.title}
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
