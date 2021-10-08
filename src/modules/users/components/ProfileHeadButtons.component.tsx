import { LockClosedIcon, XIcon } from '@heroicons/react/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ShortCard } from '../../common/components/ShortCard.component'

const ProfileHeadButtons: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-nx-white">
      <ShortCard redirect={'/profile/password'} arrow={'down'}>
        <LockClosedIcon className="h-6 pr-1 inline-block" />
        {t('userProfile.form.editPassword')}
      </ShortCard>
      <ShortCard redirect={'/profile/delete'} arrow={'down'}>
        <XIcon className="h-6 pr-1 inline-block" />
        {t('userProfile.deleteAccountTitle')}
      </ShortCard>
      {/*      <ShortCard onClick={() => {}}>
        <PresentationChartBarIcon className="h-6 pr-1 inline-block" />
        En savoir plus
      </ShortCard>*/}
    </div>
  )
}

export { ProfileHeadButtons }
