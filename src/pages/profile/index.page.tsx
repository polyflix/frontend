import React from "react";
import { useTranslation } from "react-i18next";
import fadeOpacity from "../../animations/fadeOpacity";
import Container from "../../components/Container/Container.component";
import Page from "../../components/Page/Page.component";
import Title from "../../components/Typography/Title/Title.component";
import { useAuth } from "../../hooks/useAuth.hook";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Page variants={fadeOpacity} title={t("userProfile.seo.title")}>
      <Container mxAuto>
        <Title>
          {t("userProfile.welcome")}, {user?.displayName}
        </Title>
      </Container>
    </Page>
  );
};

export default ProfilePage;
