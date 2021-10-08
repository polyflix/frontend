import { PlusIcon } from '@heroicons/react/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { Container, Title, Typography } from '../../ui'
import { fadeOpacity } from '../../ui/animations/fadeOpacity'
import { Page } from '../../ui/components/Page/Page.component'
import { useUser } from '../../users/hooks/useUser.hook'
import { GroupSlider } from '../components/GroupSlider/GroupSlider.component'
import { useGroups } from '../hooks/useGroupHooks'
import { Group } from '../models/group.model'

export const GroupsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { isLoading: isLoadingUser } = useUser({
    id,
  })
  const { data, isLoading: isLoadingGroup } = useGroups<Group[]>({
    mode: 'collection',
  })

  const joinedGroups = useGroups<Group[]>({
    mode: 'collection',
    type: 'joined',
  })

  const updateJoinedGroup = () => {
    joinedGroups.triggerReload()
  }

  const { t } = useTranslation()
  return (
    <Page
      isLoading={isLoadingGroup || isLoadingUser}
      variants={fadeOpacity}
      title={t('groupManagement.seo.title')}
    >
      {data && (
        <>
          <Container mxAuto className="px-5 flex flex-col">
            <div className="flex items-center justify-between">
              <Title className="my-5">{t('groupManagement.seo.title')}</Title>
              <Link to="/groups/create">
                <Typography
                  as="span"
                  className="flex items-center text-nx-red"
                  overrideDefaultClasses
                >
                  <PlusIcon className="w-6" />
                  {t('shared.common.actions.add') +
                    ' ' +
                    t('groupManagement.group')}
                </Typography>
              </Link>
            </div>

            <GroupSlider
              title={t('groupManagement.seo.all')}
              groups={data}
              isJoined={false}
              updateMethod={updateJoinedGroup}
            />
            <GroupSlider
              title={t('groupManagement.seo.joined')}
              groups={joinedGroups.data}
              text_no_data={t('groupManagement.nodata')}
              button_text={t('groupManagement.seo.leave')}
              updateMethod={updateJoinedGroup}
              isJoined={true}
            />
          </Container>
        </>
      )}
    </Page>
  )
}
