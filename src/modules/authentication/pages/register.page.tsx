import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../ui/components/Container/Container.component';
import { Page } from '../../ui/components/Page/Page.component';
import { RegisterForm } from '../components/RegisterForm/RegisterForm.component';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t('auth.signUp.seo.title')}
      className="flex items-center justify-center h-full"
    >
      <Container mxAuto>
        <RegisterForm />
      </Container>
    </Page>
  );
};

export default RegisterPage;
