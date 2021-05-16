import React from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { LoginForm } from "../components/LoginForm/LoginForm.component";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

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
