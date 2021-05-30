import React from "react";
import { useTranslation } from "react-i18next";
import { Container, fadeOpacity, Page } from "../../ui";
import { DeleteAcountForm } from "../components/Forms/DeleteAccountForm.component";
import { PasswordForm } from "../components/Forms/PasswordForm.component";
import { ProfileForm } from "../components/Forms/ProfileForm.component";

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page variants={fadeOpacity} title={t("userProfile.seo.title")}>
      <Container mxAuto>
        <ProfileForm />
        <PasswordForm />
        <DeleteAcountForm />
        <div className="h-10"></div>
      </Container>
    </Page>
  );
};
