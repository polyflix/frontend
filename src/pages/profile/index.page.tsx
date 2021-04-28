import React from "react";
import fadeOpacity from "../../animations/fadeOpacity";
import Container from "../../components/Container/Container.component";
import Page from "../../components/Page/Page.component";
import Title from "../../components/Typography/Title/Title.component";
import { useAuth } from "../../hooks/useAuth.hook";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Page variants={fadeOpacity} title="Profile">
      <Container mxAuto>
        <Title>Welcome back, {user?.displayName}</Title>
      </Container>
    </Page>
  );
};

export default ProfilePage;
