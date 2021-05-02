import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import Container from "../../components/Container/Container.component";
import LoginForm from "../../components/Forms/Auth/LoginForm.component";
import Page from "../../components/Page/Page.component";
import { useAuth } from "../../hooks/useAuth.hook";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <Page
      title={t("auth.signIn.seo.title")}
      className="flex items-center justify-center h-full"
    >
      <Container mxAuto>
        <LoginForm />
      </Container>
    </Page>
  );
};

export default LoginPage;
