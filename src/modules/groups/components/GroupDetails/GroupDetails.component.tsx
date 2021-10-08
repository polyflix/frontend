import React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '../../../common/utils/classes.util'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import { Group } from '../../models/group.model'
import styles from './group-details.module.scss'

type Props = {
  group: Group | null
}

export const GroupDetails: React.FC<Props> = ({ group }) => {
  const { t } = useTranslation()
  const listMembers =
    group?.members.length !== 0
      ? group?.members.map((d) => (
          <li key={d.user.id}>{d.user.firstName + ' ' + d.user.lastName}</li>
        ))
      : `${t('groupManagement.nobody')}`

  return group !== null ? (
    <div className={cn('h-32 2xl:h-72 relative', styles.video_item)}>
      <div
        className={cn(
          'bg-nx-dark w-full p-4 transition-all bg-opacity-80 h-full grid grid-flow-row gap-2 rounded-b-md',
          styles.video_item_info
        )}
      >
        <div className="grid grid-flow-col gap-1 justify-start items-center">
          <Typography as="h5">{listMembers}</Typography>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-white">{t('shared.common.errors.noData')}</div>
  )
}
