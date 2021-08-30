import { PlayIcon } from '@heroicons/react/solid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Typography } from '../../Typography/Typography.component';
import { Button } from '../Button.component';

type Props = {
  playLink: string
}

export const PlayButton: React.FC<Props> = ({ playLink }) => {
  const { t } = useTranslation();

  return (
    <Link to={playLink}>
      <Button
        as="button"
        className="flex items-center bg-nx-white text-nx-dark"
      >
        <PlayIcon className="w-6" />
        {' '}
        <Typography
          overrideDefaultClasses
          className="ml-1 text-sm md:text-base"
          as="span"
        >
          {t('shared.common.actions.play')}
        </Typography>
      </Button>
    </Link>
  );
};
