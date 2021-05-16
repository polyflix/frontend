import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../authentication";
import { Container, fadeOpacity, Page, Title } from "../../ui";

export const ProfilePage: React.FC = () => {
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
