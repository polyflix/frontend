import React from 'react';
import { DesktopComputerIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { Page } from '../../ui/components/Page/Page.component';
import { CreateVideoCard } from '../../ui/components/Cards/CreateVideoCard/CreateVideoCard.component';
import { YoutubeLogo } from '../../ui/components/Icons/YoutubeLogo.icon';
import { Container, Paragraph, Title } from '../../ui';
import { GoBack } from '../../common/components/Navigation/GoBack.component';

export const NewVideoPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title="Nouvelle video">
      <Container mxAuto className="my-5">
        <GoBack />
        <div className="flex flex-col items-center my-5">
          <Title className="mb-2">
            {t('shared.common.actions.add')}
            {' '}
            {t('videoManagement.video')}
          </Title>
          <Paragraph>{t('videoManagement.onBoarding.source')}</Paragraph>
        </div>
        <div className="flex justify-center items-center px-4 flex-col lg:flex-row">
          <CreateVideoCard
            className="mr-0 lg:mr-5"
            route="/videos/create"
            title={t('videoManagement.onBoarding.youtube.title')}
            description={t('videoManagement.onBoarding.youtube.description')}
            image={<YoutubeLogo className="hidden lg:block w-full lg:w-1/4" />}
          />
          <CreateVideoCard
            className="ml-0 lg:ml-5"
            route="/videos/create?type=upload"
            title={t('videoManagement.onBoarding.local.title')}
            description={t('videoManagement.onBoarding.local.description')}
            image={
              <DesktopComputerIcon className="text-white hidden lg:block w-full lg:w-1/4" />
            }
          />
        </div>
      </Container>
    </Page>
  );
};
