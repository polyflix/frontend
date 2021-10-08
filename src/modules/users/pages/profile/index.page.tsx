import { motion } from 'framer-motion'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Container, fadeOpacity, Page, stagger } from '../../../ui'
import { ProfileForm } from '../../components/Forms/ProfileForm.component'
import { ProfileHeadButtons } from '../../components/ProfileHeadButtons.component'

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page variants={fadeOpacity} title={t('userProfile.seo.title')}>
      <Container mxAuto>
        <motion.div
          variants={stagger(0.1)}
          className="p-5 w-full md:w-8/12 lg:w-9/12 mx-auto"
        >
          <ProfileHeadButtons />
          <ProfileForm />
          <div className="h-10"></div>
        </motion.div>
      </Container>
    </Page>
  )
}
