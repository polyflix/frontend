import React from "react";
import { Redirect } from "react-router-dom";
import Container from "../../components/Container/Container.component";
import RegisterForm from "../../components/Forms/Auth/RegisterForm.component";
import Page from "../../components/Page/Page.component";
import { useAuth } from "../../hooks/useAuth.hook";

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <Page title="Sign up" className="flex items-center justify-center h-full">
      <Container mxAuto>
        <RegisterForm />
      </Container>
    </Page>
  );
};

export default RegisterPage;
