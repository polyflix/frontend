import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Page } from '../../ui/components/Page/Page.component';
import { CollectionForm } from '../components/CollectionForm/CollectionForm.component';
import { useCollections } from '../hooks';
import { Collection } from '../models';

export const CreateUpdateCollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data, isLoading } = useCollections<Collection>({
    mode: 'document',
    slug,
  });

  return (
    <Page
      isLoading={isLoading}
      className="h-full flex items-center justify-center"
      title={`${
        slug ? t('shared.common.actions.edit') : t('shared.common.actions.add')
      } ${t('collectionManagement.collection')}`}
    >
      <CollectionForm collection={data} />
    </Page>
  );
};
