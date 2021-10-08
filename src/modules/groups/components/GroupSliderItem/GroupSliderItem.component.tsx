import {
  ChevronRightIcon,
  InformationCircleIcon,
  PencilIcon,
} from '@heroicons/react/outline'
import { useInjection } from '@polyflix/di'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '../../../common'
import { ActionLink } from '../../../common/components/ActionLink.component'
import { Button, Typography } from '../../../ui'
import { Group } from '../../models/group.model'
import { GroupService } from '../../services/group.service'

type Props = {
  group: Group
  isJoined: boolean
  updateMethod?: () => void
}

export const GroupSliderItem: React.FC<Props> = ({
  group,
  isJoined,
  updateMethod,
}) => {
  const { t } = useTranslation()
  const groupService = useInjection<GroupService>(GroupService)

  const joinLeave = (item: Group) => {
    if (!isJoined) {
      groupService.joinGroup(item.slug).then()
      if (updateMethod) {
        updateMethod()
      }
    } else {
      groupService.leaveGroup(item.slug).then()
      if (updateMethod) {
        updateMethod()
      }
    }
  }

  return (
    <div className={cn('h-64 1l:h-20 relative')}>
      <div
        className={cn(
          'bg-nx-dark w-full p-4 transition-all bg-opacity-80 h-full grid grid-flow-row gap-2 rounded-b-md'
        )}
      >
        {' '}
        <Typography bold as="h3">
          {group.title}
        </Typography>
        <div className="flex justify-end items-center">
          <ActionLink
            Icon={PencilIcon}
            text={t('shared.common.actions.edit')}
            to={group.editLink}
            className={'ml-4'}
          />
        </div>
        <div className="grid grid-flow-col gap-2 justify-start items-center">
          <Typography as="span" className="col-span-1 m-auto">
            <InformationCircleIcon className="w-6" />
          </Typography>
          <Typography as="h5">{group.description}</Typography>
        </div>
        <Button
          className="flex justify-end items-center"
          onClick={() => joinLeave(group)}
          as={'button'}
        >
          <Typography as="h4" className="text-xl pl-3" bold>
            {isJoined
              ? t('groupManagement.seo.leave')
              : t('groupManagement.seo.join')}
          </Typography>
          <ChevronRightIcon className="w-5 pt-1 text-nx-white" />
        </Button>
      </div>
    </div>
  )
}
