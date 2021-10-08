import {
  AcademicCapIcon,
  BookOpenIcon,
  CollectionIcon,
  UserIcon,
} from '@heroicons/react/outline'
import { TagIcon } from '@heroicons/react/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CreateVideoCard } from '../../ui/components/Cards/CreateVideoCard/CreateVideoCard.component'
import { Container } from '../../ui/components/Container/Container.component'
import { YoutubeLogo } from '../../ui/components/Icons/YoutubeLogo.icon'
import { Jumbotron } from '../../ui/components/Jumbotron/Jumbotron.component'
import { Page } from '../../ui/components/Page/Page.component'

export const AdminPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page title={t('admin.seo.title')}>
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t('admin.seo.title')}
          content={t('admin.onBoarding.question')}
        />
        <div>
          <div className="flex justify-center items-center mt-2 p-3 lg:flex-row">
            <CreateVideoCard
              className="mr-0 lg:mr-5"
              route="/admin/users"
              title={t('admin.onBoarding.users.title')}
              description={t('admin.onBoarding.users.description')}
              image={
                <UserIcon className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
            <CreateVideoCard
              className="ml-0 lg:ml-5"
              route="/admin/videos"
              title={t('admin.onBoarding.videos.title')}
              description={t('admin.onBoarding.videos.description')}
              image={
                <YoutubeLogo className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
          </div>
          <div className="flex justify-center items-center p-3 flex-col lg:flex-row">
            <CreateVideoCard
              className="mr-0 lg:mr-5"
              route="/admin/courses"
              title={t('admin.onBoarding.courses.title')}
              description={t('admin.onBoarding.courses.description')}
              image={
                <BookOpenIcon className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
            <CreateVideoCard
              className="ml-0 lg:ml-5"
              route="/admin/collections"
              title={t('admin.onBoarding.collections.title')}
              description={t('admin.onBoarding.collections.description')}
              image={
                <CollectionIcon className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
          </div>
          <div className="flex justify-center items-center p-3 flex-col lg:flex-row">
            <CreateVideoCard
              className="mr-0 lg:mr-5"
              route="/admin/paths"
              title={t('admin.onBoarding.paths.title')}
              description={t('admin.onBoarding.paths.description')}
              image={
                <AcademicCapIcon className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
            <CreateVideoCard
              className="ml-0 lg:ml-5"
              route="/admin/tags"
              title={t('admin.onBoarding.tags.title')}
              description={t('admin.onBoarding.tags.description')}
              image={
                <TagIcon className="text-white hidden lg:block w-full lg:w-1/4" />
              }
            />
          </div>
        </div>
      </Container>
    </Page>
  )
}
