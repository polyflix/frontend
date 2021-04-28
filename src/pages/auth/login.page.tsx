import React from "react";
import { Redirect } from "react-router-dom";
import Container from "../../components/Container/Container.component";
import LoginForm from "../../components/Forms/Auth/LoginForm.component";
import Page from "../../components/Page/Page.component";
import { useAuth } from "../../hooks/useAuth.hook";

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <Page title="Sign in" className="flex items-center justify-center h-full">
      <Container mxAuto>
        <LoginForm />
      </Container>
    </Page>
  );
};

export default LoginPage;
