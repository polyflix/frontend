import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Typography } from '../../../ui';

export const GoBack: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-nx-white">
      <Typography
        as="span"
        className="text-nx-red col-span-4"
        overrideDefaultClasses
      >
        <span
          className="inline-flex mx-2 cursor-pointer"
          onClick={() => history.goBack()}
        >
          <ArrowCircleLeftIcon className="w-6 mr-1" />
          {' '}
          {t('shared.common.actions.back')}
        </span>
      </Typography>
    </div>
  );
};
