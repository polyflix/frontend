import { motion } from 'framer-motion'
import React from 'react'

import { cn } from '../../../common'
import { NoData } from '../../../ui'
import { Paragraph } from '../../../ui'
import { Typography } from '../../../ui'
import { Group } from '../../models/group.model'

type Props = {
  group: Group
}

export const GroupHero: React.FC<Props> = ({ group }) => {
  if (!group) return <NoData />

  return (
    <>
      <div className={cn('h-screen')}>
        <motion.div
          className="w-full md:w-6/12 lg:w-4/12 h-full bg-black bg-opacity-50 flex flex-col justify-center px-5"
          style={{
            boxShadow: '0 0 80px 110px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Typography as="h1" className="text-4xl md:text-6xl" bold>
            {group.title}
          </Typography>
          <Paragraph className="my-5">{group.description}</Paragraph>
        </motion.div>
      </div>
    </>
  )
}
