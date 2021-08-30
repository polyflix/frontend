import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Page } from '../../ui/components/Page/Page.component';
import { CourseForm } from '../components/CourseForm/CourseForm.component';
import { useCourse } from '../hooks/useCourse.hook';

export const CreateUpdateCoursePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data, isLoading } = useCourse(slug);

  return (
    <Page
      isLoading={isLoading}
      className="h-full flex items-center justify-center"
      title={`${
        slug ? t('shared.common.actions.edit') : t('shared.common.actions.add')
      } ${t('courseManagement.collection')}`}
    >
      <CourseForm course={data} />
    </Page>
  );
};
