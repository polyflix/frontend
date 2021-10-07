import React from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { ResetPasswordForm } from "../components/ResetPasswordForm/ResetPasswordForm.component";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("auth.resetPassword.seo.title")} className="items-center">
      <Container mxAuto>
        <ResetPasswordForm />
      </Container>
    </Page>
  );
};

export default ResetPasswordPage;
