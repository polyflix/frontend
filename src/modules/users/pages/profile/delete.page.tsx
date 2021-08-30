import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Container, fadeOpacity, Page, stagger,
} from '../../../ui';
import { DeleteAcountForm } from '../../components/Forms/DeleteAccountForm.component';
import { GoBack } from '../../../common/components/Navigation/GoBack.component';

export const DeleteAccountPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page variants={fadeOpacity} title={t('userProfile.seo.title')}>
      <Container mxAuto>
        <motion.div
          variants={stagger(0.1)}
          className="p-5 w-full md:w-8/12 lg:w-9/12 mx-auto"
        >
          <GoBack />
          <DeleteAcountForm />
        </motion.div>
      </Container>
    </Page>
  );
};
